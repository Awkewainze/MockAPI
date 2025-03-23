import { Check } from "@awkewainze/checkverify";
import { debug } from "debug";
import gracefulShutdown from "http-graceful-shutdown";
import koa, { Context } from "koa";
import { getPortPromise } from "portfinder";
import { ClientToServerEvents, ConnectionEventsMap, Route, ServerToClientEvents } from "shared";
import { Socket } from "socket.io";
import { Router } from "./router";

export class ConnectionManager {
    private assignedPort: Nullable<number> = null;
    private routeManager: Nullable<Router> = null;
    private app: koa;
    private shutdown: () => Promise<void> = async () => {};

    constructor(private readonly socket: Socket<ConnectionEventsMap>) {
        this.socket.on(ClientToServerEvents.PreferredPorts, this.onPreferredPorts.bind(this));
        this.socket.on(ClientToServerEvents.ClientData, this.onClientData.bind(this));
        this.socket.on(ClientToServerEvents.Reset, this.onReset.bind(this));
        this.socket.on("disconnect", this.onDisconnect.bind(this));
        this.socket.on("error", this.onError.bind(this));
        this.app = new koa();
        this.app.use(this.handleRequest.bind(this));
    }

    public async handleRequest(ctx: Context): Promise<void> {
        const log = debug(`handleRequest - ${ctx.method} ${ctx.path}`);
        log("Before handle routes");
        await this.routeManager?.handle(ctx);
        log("Done");
    }

    public async destroy(): Promise<void> {
        this.emitServerShuttingDown();
        this.socket.disconnect(true);
        await this.shutdown();
    }

    private emitServerReady() {
        this.socket.emit(ServerToClientEvents.ServerReady);
    }

    private emitPort(port: number) {
        this.socket.emit(ServerToClientEvents.ProvidedPort, port);
    }

    private emitServerShuttingDown() {
        this.socket.emit(ServerToClientEvents.ServerShuttingDown);
    }

    private async onPreferredPorts(ports: number[]) {
        let foundPort: Nullable<number> = null;
        for (const port of ports) {
            if(!!await getPortPromise({ port, stopPort: port })) {
                foundPort = port;
                break;
            }
        }

        if (!foundPort) {
            foundPort = await getPortPromise();
        }

        Check.verifyNotNullOrUndefined(foundPort, "No available ports");

        if (this.assignedPort !== null) {
            await this.shutdown();
        }

        this.assignedPort = foundPort;
        this.app.listen(this.assignedPort);
        this.shutdown = gracefulShutdown(this.app);
        this.emitPort(this.assignedPort);
    }

    private onClientData(routes: Route[]) {
        this.routeManager = new Router(routes);
        this.emitServerReady();
    }

    private onReset() {

    }

    private onDisconnect(reason: string) {
        console.log("connection terminating - ", reason);
        this.shutdown();
    }

    private onError(err: Error) {
        console.error("connection error - ", err);
    }
}