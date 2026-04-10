const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const requestContext = {
  token: '',
  studentId: '',
  sessionId: '',
  chapterId: '',
};

export function setSessionContext({ token, student_id, session_id, chapter_id } = {}) {
  requestContext.token = token || '';
  requestContext.studentId = student_id || '';
  requestContext.sessionId = session_id || '';
  requestContext.chapterId = chapter_id || '';
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(requestContext.token
        ? { Authorization: `Bearer ${requestContext.token}` }
        : {}),
      ...(requestContext.studentId
        ? { 'x-student-id': requestContext.studentId }
        : {}),
      ...(requestContext.sessionId
        ? { 'x-session-id': requestContext.sessionId }
        : {}),
      ...(requestContext.chapterId
        ? { 'x-chapter-id': requestContext.chapterId }
        : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;
  try {
    data = await response.json();
  } catch (_error) {
    data = { message: 'Request failed' };
  }

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export async function fetchProgress() {
  return request('/progress');
}

export async function fetchNextQuestion({ concept } = {}) {
  const params = new URLSearchParams();
  if (concept) params.set('concept', concept);
  const query = params.toString();
  return request(query ? `/next-question?${query}` : '/next-question');
}

export async function submitAttempt(payload) {
  return request('/attempt', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function completeLesson(payload) {
  return request('/complete-lesson', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchConceptMap() {
  return request('/concept-map');
}

export async function fetchSessionSummary() {
  return request('/session-summary');
}

export async function fetchDiagnostic() {
  return request('/diagnostic');
}

export async function submitDiagnostic(answers) {
  return request('/diagnostic', {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}

export async function fetchTeachingContent({ concept }) {
  const params = new URLSearchParams();
  if (concept) params.set('concept', concept);
  const query = params.toString();
  return request(query ? `/teaching-content?${query}` : '/teaching-content');
}

export async function startSession(payload) {
  return request('/start-session', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateSessionProgress(payload) {
  return request('/update-progress', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function submitSession(payload) {
  return request('/submit-session', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
