import http from "http";
import gracefulShutdown from "http-graceful-shutdown";
import koa from "koa";
import { ConnectionEventsMap } from "shared";
import SocketIO from "socket.io";
import { ConnectionManager } from "./connectionManager";


export class Server {
    private static instance: Server;
    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    public readonly shutdown: () => Promise<void>;
    private readonly app: koa;
    private readonly server: http.Server;
    private readonly io: SocketIO.Server<ConnectionEventsMap>;
    private constructor() {
        this.app = new koa();
        this.server = http.createServer(this.app.callback());
        const options = {};
        this.io = new SocketIO.Server(this.server, options);
        this.server.listen({ port: 3000, exclusive: true });
        this.io.on("connection", this.onIOConnection.bind(this));
        this.server.on("error", (err: Error) => {
            console.error("http error: ", err);
        });
        this.app.on("error", (err: Error) => {
            console.error("koa error: ", err);
        });
        this.io.on("error", (err: Error) => {
            console.error("socket.io error: ", err);
        });
        this.shutdown = gracefulShutdown(this.server);
    }

    private onIOConnection(socket: SocketIO.Socket<ConnectionEventsMap>) {
        new ConnectionManager(socket);
    }
}
