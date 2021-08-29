import { Route } from "./routes";

export enum ClientToServerEvents {
    PreferredPorts = "PreferredPorts",
    ClientData = "ClientData",
    Reset = "Reset"
}

export enum ServerToClientEvents {
    ProvidedPort = "ProvidedPort",
    ServerReady = "ServerReady"
}

export interface ConnectionEventsMap {
    PreferredPorts: (ports: number[]) => void;
    ClientData: (routes: Route[]) => void;
    Reset: () => void;
    ProvidedPort: (port: number) => void;
    ServerReady: () => void;
}