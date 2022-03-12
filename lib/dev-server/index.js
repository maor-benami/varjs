import http from 'http';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';

let watched = {};

export class DevServer {
  constructor({ port, middleware }) {
    this.httpServer = http.createServer(middleware);
    this.httpServer.listen(port);
    this.wsServer = new WebSocketServer({
      server: this.httpServer,
      autoAcceptConnections: false
    });
  }
}

function watchDir(dir, callback) {
  let files = fs.readdirSync(path.resolve(dir));
  let watchFile = (dir, file) => {
    let filePath = path.resolve(dir, file);
    fs.watch(filePath, (event, file) => {
      let [name, ext] = file.split('.');

      if (!watched[filePath]) {
        callback(event, {
          file,
          name,
          ext,
          body: fs.readFileSync(filePath, 'utf8')
        });
        watched[filePath] = true;
      }

      setTimeout(() => {
        delete watched[filePath];
      }, 1000);
    });
  };

  files.forEach((file) => {
    let isDir = file.indexOf('.') < 0;

    if (isDir) {
      watchDir(path.join(dir, file), callback);
    } else {
      watchFile(dir, file);
    }
  });
}

export class FileWatcher {
  constructor({ dir, callback }) {
    watchDir(dir, callback);
  }
}
