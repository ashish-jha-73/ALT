const lessons = require('../data/lessons');

function getLessonKey(concept, level) {
  return `${concept}::L${level}`;
}

function getLesson(concept, level) {
  const byConcept = lessons[concept] || {};
  return byConcept[level] || null;
}

function getPendingLesson(user, concept, level) {
  const lesson = getLesson(concept, level);
  if (!lesson) return null;

  const key = getLessonKey(concept, level);
  const taught = new Set(user.progress.taught_lessons || []);

  if (taught.has(key)) return null;

  return {
    key,
    concept,
    level,
    ...lesson,
  };
}

function markLessonAsComplete(user, lessonKey) {
  if (!lessonKey) return;

  const taught = new Set(user.progress.taught_lessons || []);
  taught.add(lessonKey);
  user.progress.taught_lessons = [...taught];
}

module.exports = {
  getLessonKey,
  getLesson,
  getPendingLesson,
  markLessonAsComplete,
};
