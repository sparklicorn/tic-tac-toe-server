import { env } from 'node:process';

import app from './app';
import routes from './controllers/index';

const host = env.HOST || '0.0.0.0';
const port = parseInt(env.PORT, 10) || 3000;

routes.forEach((route) => {
  app[route.method](route.path, route.callback);
});

app.listen(port, host, () => {
  console.log(`App serving static content on port ${port}`);
});
