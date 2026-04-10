import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import DiagnosticScreen from './components/DiagnosticScreen';
import TeachingCard from './components/TeachingCard';
import ConceptMapView from './components/ConceptMapView';
import QuestionScreen from './components/QuestionScreen';
import LessonScreen from './components/LessonScreen';
import FeedbackPanel from './components/FeedbackPanel';
import EndScreen from './components/EndScreen';
import MasteryPopup from './components/MasteryPopup';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import {
  completeLesson,
  fetchConceptMap,
  fetchDiagnostic,
  fetchNextQuestion,
  fetchProgress,
  fetchSessionSummary,
  fetchTeachingContent,
  setSessionContext as setApiSessionContext,
  startSession,
  submitAttempt,
  submitDiagnostic,
  submitSession,
  updateSessionProgress,
} from './services/api';

const SESSION_TARGET_QUESTIONS = 10;
const CHAPTER_ID = import.meta.env.VITE_CHAPTER_ID || 'grade8_linear_equations_in_one_variable';
const FINAL_CHAPTER_CONCEPT_ID = 'word_problems_advanced';
const SESSION_STORAGE = {
  token: 'token',
  studentId: 'student_id',
  sessionId: 'session_id',
  chapterId: 'chapter_id',
};
const FAILED_SUBMISSION_PREFIX = 'failed_session_submission:';

function resolveMissionConcept(progressData, conceptMapData, previousConcept = '') {
  const progressState = progressData?.progress || {};
  const completed = new Set(progressState.completed_concepts || []);
  const unlocked = new Set(progressState.unlocked_concepts || []);
  const current = progressState.current_concept;

  if (current && unlocked.has(current) && !completed.has(current)) {
    return current;
  }

  const nodes = conceptMapData?.nodes || [];
  if (previousConcept) {
    const idx = nodes.findIndex((n) => n.id === previousConcept);
    if (idx >= 0) {
      for (let i = idx + 1; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.status === 'unlocked' && !completed.has(node.id)) {
          return node.id;
        }
      }
    }
  }

  const unlockedNode = nodes.find((n) => n.status === 'unlocked' && !completed.has(n.id));
  if (unlockedNode) {
    return unlockedNode.id;
  }

  const unlockedConcept = [...unlocked].find((id) => !completed.has(id));
  if (unlockedConcept) {
    return unlockedConcept;
  }

  return current || 'expressions_foundation';
}

function isChapterCompleted(progressData, conceptMapData) {
  const nodes = conceptMapData?.nodes || [];
  if (nodes.length > 0) {
    const completedNodes = nodes.filter((node) => node.status === 'completed').length;
    const allConceptsCompleted = completedNodes === nodes.length;
    const finalConceptCompleted = nodes.some(
      (node) => node.id === FINAL_CHAPTER_CONCEPT_ID && node.status === 'completed'
    );

    return allConceptsCompleted && finalConceptCompleted;
  }

  return false;
}

function readSessionContextFromUrl() {
  const params = new URLSearchParams(window.location.search || '');

  const tokenFromUrl = params.get('token');
  const studentIdFromUrl = params.get('student_id');
  const sessionIdFromUrl = params.get('session_id');
  const chapterIdFromUrl = params.get('chapter_id');

  if (tokenFromUrl) {
    sessionStorage.setItem(SESSION_STORAGE.token, tokenFromUrl);
  }
  if (studentIdFromUrl) {
    sessionStorage.setItem(SESSION_STORAGE.studentId, studentIdFromUrl);
  }
  if (sessionIdFromUrl) {
    sessionStorage.setItem(SESSION_STORAGE.sessionId, sessionIdFromUrl);
  }
  if (chapterIdFromUrl) {
    sessionStorage.setItem(SESSION_STORAGE.chapterId, chapterIdFromUrl);
  }

  return {
    token: sessionStorage.getItem(SESSION_STORAGE.token) || '',
    student_id: sessionStorage.getItem(SESSION_STORAGE.studentId) || '',
    session_id: sessionStorage.getItem(SESSION_STORAGE.sessionId) || '',
    chapter_id: sessionStorage.getItem(SESSION_STORAGE.chapterId) || CHAPTER_ID,
  };
}

function clearStoredSessionContext() {
  sessionStorage.removeItem(SESSION_STORAGE.token);
  sessionStorage.removeItem(SESSION_STORAGE.studentId);
  sessionStorage.removeItem(SESSION_STORAGE.sessionId);
  sessionStorage.removeItem(SESSION_STORAGE.chapterId);
}

function hasValidSessionContext(sessionContext) {
  return Boolean(
    sessionContext?.token && sessionContext?.student_id && sessionContext?.session_id
  );
}

function failedSubmissionKey(sessionId) {
  return `${FAILED_SUBMISSION_PREFIX}${sessionId}`;
}

function readFailedSubmission(sessionId) {
  try {
    const raw = window.localStorage.getItem(failedSubmissionKey(sessionId));
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

function persistFailedSubmission(sessionId, payload) {
  try {
    window.localStorage.setItem(failedSubmissionKey(sessionId), JSON.stringify(payload));
  } catch (_error) {
    // ignore storage failures
  }
}

function clearFailedSubmission(sessionId) {
  try {
    window.localStorage.removeItem(failedSubmissionKey(sessionId));
  } catch (_error) {
    // ignore storage failures
  }
}

function stringifyUpstreamError(upstreamResponse) {
  if (!upstreamResponse) return '';
  if (typeof upstreamResponse === 'string') return upstreamResponse;
  if (typeof upstreamResponse.message === 'string' && upstreamResponse.message.trim()) {
    return upstreamResponse.message.trim();
  }

  try {
    return JSON.stringify(upstreamResponse);
  } catch (_error) {
    return '';
  }
}

function App() {
  const [sessionContext, setSessionContextState] = useState(null);
  const [userName, setUserName] = useState('');
  const [progress, setProgress] = useState(null);
  const [conceptMap, setConceptMap] = useState(null);
  const [questionPayload, setQuestionPayload] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [summary, setSummary] = useState(null);
  const [screen, setScreen] = useState('map');
  const [retryEnabled, setRetryEnabled] = useState(false);
  const [pendingRetryAttempts, setPendingRetryAttempts] = useState(1);
  const [attemptsInSession, setAttemptsInSession] = useState(0);
  const [hintsUsedSession, setHintsUsedSession] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [xpToast, setXpToast] = useState({ visible: false, amount: 0, key: 0 });
  const [masteryPopup, setMasteryPopup] = useState({ show: false, concept: '' });
  const [diagnosticQuestions, setDiagnosticQuestions] = useState(null);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [diagnosticCompleted, setDiagnosticCompleted] = useState(false);
  const [learnerLevel, setLearnerLevel] = useState(0);
  const [teachingContext, setTeachingContext] = useState(null);
  const [activeMissionConcept, setActiveMissionConcept] = useState('');
  const [sessionSubmission, setSessionSubmission] = useState(null);
  const [chapterCompleted, setChapterCompleted] = useState(false);
  const [sessionMetricsLocked, setSessionMetricsLocked] = useState(false);
  const [submittingSession, setSubmittingSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const exitSubmissionSentRef = useRef(false);
  const retryingStoredSubmissionRef = useRef(false);
  const autoCompletedSubmitAttemptedRef = useRef(false);

  function resetSessionContext(
    message = 'Session cleared. Reopen with /chapter?token=<jwt>&student_id=<id>&session_id=<id>'
  ) {
    if (sessionContext?.session_id) {
      clearFailedSubmission(sessionContext.session_id);
    }

    clearStoredSessionContext();
    setApiSessionContext({ token: '', student_id: '', session_id: '', chapter_id: '' });
    setSessionContextState(null);
    setUserName('');
    setProgress(null);
    setConceptMap(null);
    setQuestionPayload(null);
    setSummary(null);
    setFeedback(null);
    setScreen('map');
    setRetryEnabled(false);
    setPendingRetryAttempts(1);
    setActiveMissionConcept('');
    setSessionSubmission(null);
    setChapterCompleted(false);
    setSessionMetricsLocked(false);
    exitSubmissionSentRef.current = false;
    autoCompletedSubmitAttemptedRef.current = false;
    setError(message);
  }

  useEffect(() => {
    if (!xpToast.visible) return undefined;
    const timer = setTimeout(() => {
      setXpToast((prev) => ({ ...prev, visible: false }));
    }, 2000);
    return () => clearTimeout(timer);
  }, [xpToast]);

  async function loadProgress() {
    const data = await fetchProgress();
    if (data?.student_id) {
      setUserName(data.student_id);
    }
    setProgress(data);
    return data;
  }

  async function loadConceptMap() {
    const data = await fetchConceptMap();
    setConceptMap(data);
    return data;
  }

  async function loadNextQuestion(concept) {
    const payload = await fetchNextQuestion({ concept });
    setQuestionPayload(payload);
    setRetryEnabled(false);
    setPendingRetryAttempts(1);
    return payload;
  }

  async function loadSummary() {
    const data = await fetchSessionSummary();
    setSummary(data);
  }

  useEffect(() => {
    const resolvedContext = readSessionContextFromUrl();
    if (!hasValidSessionContext(resolvedContext)) {
      setError('Missing token, student_id, or session_id. Use /chapter?token=<jwt>&student_id=<id>&session_id=<id>');
      return;
    }

    setApiSessionContext(resolvedContext);
    setSessionContextState(resolvedContext);
    setUserName(resolvedContext.student_id);
  }, []);

  useEffect(() => {
    async function bootstrapSession() {
      if (!sessionContext) return;

      try {
        setLoading(true);
        setError('');

        const startedSession = await startSession({
          student_id: sessionContext.student_id,
          session_id: sessionContext.session_id,
          chapter_id: sessionContext.chapter_id || CHAPTER_ID,
          total_questions: SESSION_TARGET_QUESTIONS,
        });

        exitSubmissionSentRef.current = false;
        autoCompletedSubmitAttemptedRef.current = false;
        setSessionMetricsLocked(false);

        if (startedSession?.status === 'submitted' || startedSession?.status === 'submitting') {
          setChapterCompleted(true);
          setSessionMetricsLocked(true);
          autoCompletedSubmitAttemptedRef.current = true;

          let existingRecommendation = startedSession?.submitted_response || null;
          if (!existingRecommendation && startedSession?.status === 'submitted') {
            try {
              const existingResponse = await submitSession({
                student_id: sessionContext.student_id,
                session_id: sessionContext.session_id,
                chapter_id: sessionContext.chapter_id || CHAPTER_ID,
                token: sessionContext.token,
                session_status: 'completed',
              });
              existingRecommendation = existingResponse?.recommendation || null;
            } catch (existingError) {
              if (existingError?.status === 409 && existingError?.payload?.recommendation) {
                existingRecommendation = existingError.payload.recommendation;
              }
            }
          }

          if (startedSession?.status === 'submitted') {
            setSessionSubmission({
              submitted: true,
              recommendation: existingRecommendation || {},
            });
          }

          await loadSummary();
          setScreen('end');
          setError('This session_id is already submitted. Open the chapter from the portal to get a new session_id.');
          return;
        }

        const storedSubmission = readFailedSubmission(sessionContext.session_id);
        if (storedSubmission && !retryingStoredSubmissionRef.current) {
          retryingStoredSubmissionRef.current = true;
          try {
            const normalizedStoredSubmission = {
              ...storedSubmission,
              student_id: sessionContext.student_id,
              session_id: sessionContext.session_id,
              chapter_id: sessionContext.chapter_id || CHAPTER_ID,
              token: sessionContext.token,
            };

            const retryResponse = await submitSession(normalizedStoredSubmission);
            setSessionSubmission(retryResponse);
            clearFailedSubmission(sessionContext.session_id);
          } catch (retryError) {
            if (retryError?.status === 409 && retryError?.payload?.recommendation) {
              setSessionSubmission({
                submitted: true,
                recommendation: retryError.payload.recommendation,
              });
              clearFailedSubmission(sessionContext.session_id);
            } else if (retryError?.status === 400 && Array.isArray(retryError?.payload?.errors)) {
              // Validation failures won't be fixed by replaying the same payload snapshot.
              clearFailedSubmission(sessionContext.session_id);
            }
          } finally {
            retryingStoredSubmissionRef.current = false;
          }
        }

        const progressData = await loadProgress();
        const conceptMapData = await loadConceptMap();
        const existingMetrics = progressData?.session_metrics || {};
        const existingAttempted = Number(existingMetrics.questions_attempted || 0);
        const existingTotal = Number(existingMetrics.total_questions || SESSION_TARGET_QUESTIONS);
        setSessionMetricsLocked(existingTotal > 0 && existingAttempted >= existingTotal);
        setChapterCompleted(isChapterCompleted(progressData, conceptMapData));
        setActiveMissionConcept(resolveMissionConcept(progressData, conceptMapData));

        try {
          const diagData = await fetchDiagnostic();
          if (diagData.diagnostic_completed) {
            setDiagnosticCompleted(true);
            setLearnerLevel(diagData.learner_level || 1);
            setScreen('map');
          } else {
            setDiagnosticQuestions(diagData.questions);
            setDiagnosticCompleted(false);
            setScreen('diagnostic');
          }
        } catch {
          setDiagnosticCompleted(true);
          setScreen('map');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    bootstrapSession();
  }, [sessionContext]);

  useEffect(() => {
    if (!sessionContext) return undefined;

    function buildExitPayload() {
      const resolvedStatus = chapterCompleted ? 'completed' : 'exited_midway';
      return {
        student_id: sessionContext.student_id,
        session_id: sessionContext.session_id,
        chapter_id: sessionContext.chapter_id || CHAPTER_ID,
        token: sessionContext.token,
        session_status: resolvedStatus,
      };
    }

    function submitOnExit() {
      if (exitSubmissionSentRef.current || sessionSubmission?.submitted || submittingSession) {
        return;
      }

      const payload = buildExitPayload();
      persistFailedSubmission(sessionContext.session_id, payload);

      let sent = false;
      try {
        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
          sent = navigator.sendBeacon('/api/submit-session', blob);
        }
      } catch (_error) {
        sent = false;
      }

      if (!sent) {
        fetch('/api/submit-session', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionContext.token}`,
            'Content-Type': 'application/json',
            'x-student-id': sessionContext.student_id,
            'x-session-id': sessionContext.session_id,
          },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {
          // intentionally ignored; payload is persisted for retry on next load
        });
      }

      exitSubmissionSentRef.current = true;
    }

    function handleBeforeUnload(event) {
      if (sessionSubmission?.submitted || submittingSession) {
        return;
      }

      if (screen !== 'end') {
        event.preventDefault();
        event.returnValue = '';
      }
      submitOnExit();
    }

    function handlePageHide() {
      if (sessionSubmission?.submitted || submittingSession) {
        return;
      }

      submitOnExit();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [chapterCompleted, screen, sessionContext, sessionSubmission?.submitted, submittingSession]);

  async function handleDiagnosticSubmit(answers) {
    try {
      setLoading(true);
      setError('');

      const result = await submitDiagnostic(answers);
      setDiagnosticResult(result);
      setDiagnosticCompleted(true);
      setLearnerLevel(result.learner_level);

      await updateSessionProgress({ status: 'in_progress' });

      if ((result.xp_earned || 0) > 0) {
        setXpToast({ visible: true, amount: result.xp_earned, key: Date.now() });
      }

      const progressData = await loadProgress();
      const conceptMapData = await loadConceptMap();
      setActiveMissionConcept(resolveMissionConcept(progressData, conceptMapData));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDiagnosticContinue() {
    setScreen('map');
    setDiagnosticResult(null);
  }

  async function handleTeachingComplete() {
    setTeachingContext(null);
    try {
      setLoading(true);
      await loadNextQuestion(activeMissionConcept || undefined);
      setScreen('question');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function startMission() {
    try {
      setLoading(true);
      setError('');
      setFeedback(null);

      const freshProgress = await loadProgress();
      const freshConceptMap = await loadConceptMap();
      const missionConcept = resolveMissionConcept(freshProgress, freshConceptMap, activeMissionConcept);
      setActiveMissionConcept(missionConcept);

      let teachCtx = null;
      try {
        teachCtx = await fetchTeachingContent({ concept: missionConcept });
        setTeachingContext(teachCtx);
        setLearnerLevel(teachCtx.learner_level || learnerLevel || 1);
      } catch {
        setTeachingContext(null);
        teachCtx = null;
      }

      await loadNextQuestion(missionConcept);

      if (teachCtx) {
        setScreen('teaching');
      } else {
        setScreen('question');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(payload) {
    if (questionPayload?.activity_type !== 'question') return;

    try {
      setLoading(true);
      setError('');

      const result = await submitAttempt({
        student_id: sessionContext.student_id,
        session_id: sessionContext.session_id,
        user_name: userName,
        question_id: questionPayload.question.id,
        selected_answer: payload.selected_answer,
        attempts: payload.attempts,
        time_taken: payload.time_taken,
        used_hints: payload.used_hints,
        confidence: payload.confidence,
        skipped: payload.skipped,
        action_taken: questionPayload?.adaptive_context?.selected_action,
      });

      setFeedback(result);
      setHintsUsedSession((prev) => prev + (payload.used_hints || 0));

      if (!result.correctness && !payload.skipped) {
        setRetryEnabled(true);
        setPendingRetryAttempts((payload.attempts || 1) + 1);
        setScreen('feedback');
        return;
      }

      if (!sessionMetricsLocked) {
        await updateSessionProgress({
          increments: {
            correct_answers: result.correctness ? 1 : 0,
            wrong_answers: result.correctness ? 0 : 1,
            questions_attempted: 1,
            retry_count: Number(payload.attempts || 1) > 1 ? 1 : 0,
            hints_used: Number(payload.used_hints || 0),
            total_hints_embedded: Array.isArray(questionPayload?.question?.hints)
              ? questionPayload.question.hints.length
              : 0,
            time_spent_seconds: Number(payload.time_taken || 0),
          },
          status: 'in_progress',
        });
      }

      if ((result.xp_earned || 0) > 0) {
        setXpToast({ visible: true, amount: result.xp_earned, key: Date.now() });
      }

      const prevCompleted = progress?.progress?.completed_concepts || [];

      const updatedProgress = await loadProgress();
      const updatedConceptMap = await loadConceptMap();

      const nodeCount = (updatedConceptMap?.nodes || []).length || 1;
      const completedCount = (updatedProgress?.progress?.completed_concepts || []).length;
      await updateSessionProgress({
        topic_completion_ratio: Math.max(0, Math.min(1, completedCount / nodeCount)),
      });

      const chapterDoneNow = isChapterCompleted(updatedProgress, updatedConceptMap);
      setChapterCompleted(chapterDoneNow);

      const newCompleted = updatedProgress?.progress?.completed_concepts || [];
      const justMastered = newCompleted.find((c) => !prevCompleted.includes(c));
      if (justMastered) {
        setMasteryPopup({ show: true, concept: justMastered.replace(/_/g, ' ') });
      }

      let missionConcept = activeMissionConcept || resolveMissionConcept(updatedProgress, updatedConceptMap);
      if (missionConcept && newCompleted.includes(missionConcept)) {
        missionConcept = resolveMissionConcept(updatedProgress, updatedConceptMap, missionConcept);
      }
      setActiveMissionConcept(missionConcept || '');

      setRetryEnabled(false);
      setPendingRetryAttempts(1);
      const nextCount = attemptsInSession + 1;
      setAttemptsInSession(nextCount);

      if (chapterDoneNow) {
        // Freeze metrics only when full chapter completion is reached.
        setSessionMetricsLocked(true);
        await loadSummary();
        setScreen('end');
        return;
      }

      if (nextCount >= SESSION_TARGET_QUESTIONS) {
        // Intermediate checkpoint only; final submission remains disabled until chapter completion.
        setSessionMetricsLocked(true);
        setAttemptsInSession(0);
        setError('Checkpoint reached. Continue learning to complete the full chapter before final submission.');
        setScreen('map');
        return;
      }

      await loadNextQuestion(missionConcept || undefined);
      setScreen('feedback');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteLesson(lessonKey) {
    try {
      setLoading(true);
      setError('');
      await completeLesson({
        student_id: sessionContext.student_id,
        session_id: sessionContext.session_id,
        user_name: userName,
        lesson_key: lessonKey,
      });
      await loadNextQuestion(activeMissionConcept || undefined);
      setScreen('question');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function continueAfterFeedback() {
    setScreen('question');
  }

  async function skipFromNeedReview() {
    await handleSubmit({
      selected_answer: '__SKIPPED__',
      confidence: feedback?.inferred_confidence?.label === 'overconfident' ? 'medium' : 'low',
      attempts: pendingRetryAttempts,
      used_hints: 0,
      time_taken: 1,
      skipped: true,
    });
  }

  async function continueAfterEnd() {
    if (sessionSubmission?.submitted) {
      resetSessionContext('Session submitted successfully. Open the chapter from the portal to start a new session.');
      return;
    }

    setAttemptsInSession(0);
    setHintsUsedSession(0);
    setSummary(null);
    setFeedback(null);
    setActiveMissionConcept('');
    setSessionSubmission(null);
    autoCompletedSubmitAttemptedRef.current = false;
    setSessionMetricsLocked(true);
    setError('');
    setScreen('map');

    const progressData = await loadProgress();
    const conceptMapData = await loadConceptMap();
    setChapterCompleted(isChapterCompleted(progressData, conceptMapData));
    setActiveMissionConcept(resolveMissionConcept(progressData, conceptMapData));
  }

  async function handleSubmitSession(finalStatus = 'completed') {
    if (!sessionContext) return;

    if (finalStatus === 'completed' && !chapterCompleted) {
      setError('Chapter is not complete yet. Continue learning; submit only at final chapter completion.');
      return;
    }

    const payload = {
      student_id: sessionContext.student_id,
      session_id: sessionContext.session_id,
      chapter_id: sessionContext.chapter_id || CHAPTER_ID,
      token: sessionContext.token,
      session_status: finalStatus,
    };

    try {
      setSubmittingSession(true);
      setError('');

      const response = await submitSession(payload);

      setSessionSubmission(response);
      clearFailedSubmission(sessionContext.session_id);
    } catch (err) {
      if (err?.status === 409 && err?.payload?.recommendation) {
        setSessionSubmission({
          submitted: true,
          recommendation: err.payload.recommendation,
        });
        clearFailedSubmission(sessionContext.session_id);
        return;
      }

      const validationErrors = Array.isArray(err?.payload?.errors) ? err.payload.errors : [];
      if (validationErrors.length > 0) {
        // Validation errors need metrics changes, not replaying the same failed snapshot.
        clearFailedSubmission(sessionContext.session_id);
        setError(`${err.message}: ${validationErrors.join('; ')}`);
        return;
      }
      const upstreamStatus = err?.payload?.upstream_status;
      const upstreamDetails = stringifyUpstreamError(err?.payload?.upstream_response);
      const attemptedChapterIds = Array.isArray(err?.payload?.attempted_chapter_ids)
        ? err.payload.attempted_chapter_ids.filter(Boolean)
        : [];
      const statusSuffix = upstreamStatus ? ` (upstream ${upstreamStatus})` : '';
      const detailSuffix = upstreamDetails ? `: ${upstreamDetails}` : '';
      const attemptedSuffix = attemptedChapterIds.length > 0
        ? ` Attempted chapter_id values: ${attemptedChapterIds.join(', ')}`
        : '';

      const chapterIdMissing =
        upstreamStatus === 400
        && typeof upstreamDetails === 'string'
        && upstreamDetails.toLowerCase().includes('chapter_id')
        && upstreamDetails.toLowerCase().includes('not found');

      if (chapterIdMissing) {
        clearFailedSubmission(sessionContext.session_id);
        setError(`${err.message}${statusSuffix}${detailSuffix}.${attemptedSuffix}`);
        return;
      }

      persistFailedSubmission(sessionContext.session_id, payload);

      setError(
        `${err.message}${statusSuffix}${detailSuffix}.${attemptedSuffix} Submission payload saved locally and will retry automatically.`
      );
    } finally {
      setSubmittingSession(false);
    }
  }

  const closeMasteryPopup = useCallback(() => {
    setMasteryPopup({ show: false, concept: '' });
  }, []);

  const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);

  if (!sessionContext) {
    return (
      <div className="app-shell app-shell--auth">
        <div className="auth-card anim-fade-in" style={{ maxWidth: 520 }}>
          <h1 className="auth-card__title">Session Context Required</h1>
          <p className="auth-card__subtitle" style={{ marginBottom: 12 }}>
            Open this app using: /chapter?token=&lt;jwt&gt;&amp;student_id=&lt;id&gt;&amp;session_id=&lt;id&gt;
          </p>
          {error ? <p className="feedback-screen__calibration">{error}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        userName={userName}
        progress={progress}
        conceptMap={conceptMap}
        attemptsInSession={attemptsInSession}
        hintsUsedSession={hintsUsedSession}
        timeSpentSession={timeSpent}
        currentScreen={screen}
        onNavigateMap={() => setScreen('map')}
        onLogout={resetSessionContext}
      />

      <div className="main-area">
        <Header
          progress={progress}
          conceptMap={conceptMap}
          attemptsInSession={attemptsInSession}
          sessionTarget={SESSION_TARGET_QUESTIONS}
          screen={screen}
          questionPayload={questionPayload}
          activeMissionConcept={activeMissionConcept}
        />

        <div className="content">
          {error && (
            <div className="error-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
              <button type="button" onClick={() => setError('')}>&times;</button>
            </div>
          )}

           {screen === 'diagnostic' && !diagnosticCompleted && diagnosticQuestions && (
             <DiagnosticScreen
               questions={diagnosticQuestions}
               onSubmit={handleDiagnosticSubmit}
               loading={loading}
               result={null}
             />
           )}

           {screen === 'diagnostic' && diagnosticCompleted && diagnosticResult && (
             <DiagnosticScreen
               questions={diagnosticQuestions}
               onSubmit={handleDiagnosticSubmit}
               loading={loading}
               result={diagnosticResult}
             />
           )}

           {screen === 'diagnostic' && diagnosticCompleted && diagnosticResult && (
             <div style={{ textAlign: 'center', marginTop: 'var(--sp-4)' }}>
               <button type="button" className="btn-primary" onClick={handleDiagnosticContinue}>
                 Start Learning
               </button>
             </div>
           )}

           {screen === 'teaching' && teachingContext && (
             <TeachingCard
               concept={teachingContext.concept}
               learnerLevel={teachingContext.learner_level || learnerLevel}
               adaptiveHint={teachingContext.adaptive_hint}
               onComplete={handleTeachingComplete}
             />
           )}

           {screen === 'map' && (
             <ConceptMapView conceptMap={conceptMap} onStart={startMission} />
           )}

           {screen === 'question' && (
             questionPayload?.activity_type === 'lesson' ? (
               <LessonScreen
                 payload={questionPayload}
                 loading={loading}
                 onComplete={handleCompleteLesson}
                 onBackToMap={() => setScreen('map')}
               />
             ) : (
               <QuestionScreen
                 payload={questionPayload}
                 onSubmit={handleSubmit}
                 loading={loading}
                 initialAttempts={pendingRetryAttempts}
                 feedback={feedback}
                 onBackToMap={() => setScreen('map')}
               />
             )
           )}

           {screen === 'feedback' && (
             <FeedbackPanel
               feedback={feedback}
               retryEnabled={retryEnabled}
               pendingRetryAttempts={pendingRetryAttempts}
               attemptsInSession={attemptsInSession}
               sessionTarget={SESSION_TARGET_QUESTIONS}
               onContinue={continueAfterFeedback}
               onRetry={continueAfterFeedback}
               onSkip={skipFromNeedReview}
               loading={loading}
             />
           )}

           {screen === 'end' && (
             <EndScreen
               summary={summary}
               onContinue={continueAfterEnd}
               onSubmitSession={handleSubmitSession}
               submittingSession={submittingSession}
               chapterCompleted={chapterCompleted}
               sessionSubmission={sessionSubmission}
             />
           )}
         </div>
       </div>

       {xpToast.visible && (
         <div key={xpToast.key} className="xp-toast-wrap" aria-live="polite">
           <div className="xp-toast">+{xpToast.amount} XP</div>
           <div className="xp-burst" aria-hidden="true">
             <span className="spark s1" />
             <span className="spark s2" />
             <span className="spark s3" />
             <span className="spark s4" />
             <span className="spark s5" />
             <span className="spark s6" />
           </div>
         </div>
       )}

       <MasteryPopup
         conceptName={masteryPopup.concept}
         show={masteryPopup.show}
         onClose={closeMasteryPopup}
       />
     </div>
   );
 }

 export default App;
