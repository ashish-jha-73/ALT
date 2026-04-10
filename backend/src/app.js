const express = require('express');
const fs = require('fs');
const path = require('path');
const learningRoutes = require('./routes/learningRoutes');
const sessionRoutes = require('./routes/sessionRoutes');


const app = express();

app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', learningRoutes);
app.use('/api', sessionRoutes);

const frontendDistPath = path.join(__dirname, '../../frontend/dist');

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    return res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.use('/api', (_, res) => {
  res.status(404).json({ message: 'API route not found' });
});

module.exports = app;
