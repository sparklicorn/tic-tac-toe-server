import express from 'express';

import routes from './controllers/index.js';

class App {
  private static instance: App;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new App();
    }

    return this.instance;
  }

  private _app: express.Express;

  private constructor() {
    this._app = express();
  }

  get express() {
    return this._app;
  }

  start(port: number, host: string) {
    // Serve webpacked content in ./dist
    this._app.use(express.static('dist'));

    routes.forEach((route) => {
      this._app[route.method](route.path, route.callback);
    });

    this._app.listen(port, host, () => {
      console.log(`App serving static content on port ${port}`);
    });
  }
}

export default App.getInstance();
