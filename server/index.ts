import app from './app.js';

app.start(
  parseInt(process.env.PORT) || 3000,
  process.env.HOST || '0.0.0.0'
);
