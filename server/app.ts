import { json, urlencoded } from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as path from "path";

import { feedRouter } from "./routes/feed";
import { loginRouter } from "./routes/login";
import { protectedRouter } from "./routes/protected";
import { publicRouter } from "./routes/public";
import { userRouter } from "./routes/user";
import * as socketIo from "socket.io";

const app: express.Application = express();

app.disable("x-powered-by");

app.use(json());
app.use(compression());
app.use(urlencoded({ extended: true }));

// api routes
app.use("/api/secure", protectedRouter);
app.use("/api/login", loginRouter);
app.use("/api/public", publicRouter);
app.use("/api/feed", feedRouter);
app.use("/api/user", userRouter);

if (app.get("env") === "production") {

  // in production mode run application from dist folder
  app.use(express.static(path.join(__dirname, "/../client")));
}

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next) => {
  const err = new Error("Not Found");
  next(err);
});

// production error handler
// no stacktrace leaked to user
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {

  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message,
  });
});

export { app };




// import * as express from "express";
// import * as http from "http";
// import * as socketIo from "socket.io";

// // import { Message } from "./model";

// export class Server {
//     public static readonly PORT:number = 8080;
//     public app: any;
//     private server: any;
//     private io: any;
//     private port: string | number;

//     public static bootstrap(): Server {
//         return new Server();
//     }

//     constructor() {
//         this.createApp();
//         this.config();
//         this.createServer();
//         this.sockets();
//         this.listen();
//     }

//     private createApp(): void {
//         this.app = express();
//     }

//     private createServer(): void {
//         this.server = http.createServer(this.app);
//     }

//     private config(): void {
//         this.port = process.env.PORT || Server.PORT;
//     }

//     private sockets(): void {
//         this.io = socketIo(this.server);
//     }

//     private listen(): void {
//         this.server.listen(this.port, () => {
//             console.log('Running server on port %s', this.port);
//         });

//         this.io.on('connect', (socket: any) => {
//             console.log('Connected client on port %s.', this.port);
//             socket.on('message', (m: any) => {
//                 console.log('[server](message): %s', JSON.stringify(m));
//                 this.io.emit('message', m);
//             });

//             socket.on('disconnect', () => {
//                 console.log('Client disconnected');
//             });
//         });
//     }
// }

// let server = Server.bootstrap();
// export default server.app;
