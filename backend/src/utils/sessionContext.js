function firstNonEmpty(...values) {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return '';
}

function getBearerToken(req) {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');
  if (type === 'Bearer' && token) return token.trim();

  return firstNonEmpty(
    req.body && req.body.token,
    req.query && req.query.token,
    req.headers['x-session-token']
  );
}

function resolveSessionIdentity(req) {
  return {
    studentId: firstNonEmpty(
      req.headers['x-student-id'],
      req.body && req.body.student_id,
      req.query && req.query.student_id
    ),
    sessionId: firstNonEmpty(
      req.headers['x-session-id'],
      req.body && req.body.session_id,
      req.query && req.query.session_id
    ),
  };
}

function resolveChapterId(req) {
  return firstNonEmpty(
    req.headers['x-chapter-id'],
    req.body && req.body.chapter_id,
    req.query && req.query.chapter_id
  );
}

function getRequiredSessionIdentity(req) {
  const identity = resolveSessionIdentity(req);
  if (!identity.studentId || !identity.sessionId) {
    throw new Error('student_id and session_id are required');
  }
  return identity;
}

module.exports = {
  getBearerToken,
  resolveSessionIdentity,
  resolveChapterId,
  getRequiredSessionIdentity,
};