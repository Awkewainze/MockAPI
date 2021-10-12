import { Duration } from "@awkewainze/simpleduration";
import { Timer } from "@awkewainze/simpletimer";
import * as ls from "local-storage";
import { DateTime } from "luxon";
import * as React from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { Subscription } from "rxjs";
import { LogEvent, LogStreamService } from "../../services";
import "./style.scss";

interface IProps {
}

interface IState {
    events: Array<LogEvent>;
    logTailing: boolean;
    logFilter: "all" | "client-only" | "server-only";
    humanReadableDates: boolean;
    logNotification: boolean;
}

type PersistentState = Partial<Omit<IState, "events">>;
export class ConsoleComponent extends React.PureComponent<IProps, IState> {
    private static readonly PersistentStateKey = "ConsolePreferences"; 
    constructor(props: IProps) {
        super(props);
        this.handleNavSelect = this.handleNavSelect.bind(this);
        this.notifyLogAdded = this.notifyLogAdded.bind(this);
        this.logFilter = this.logFilter.bind(this);
        this.onEvent = this.onEvent.bind(this);
        this.eventToLine = this.eventToLine.bind(this);
        this.state = {
            events: [],
            logTailing: true,
            logFilter: "all",
            humanReadableDates: false,
            logNotification: false,
            ...(ls.get<PersistentState>(ConsoleComponent.PersistentStateKey) ?? {})
        };

        this.updatePersistentState();
    }

    private subscription: Subscription | null = null;
    componentDidMount(): void {
        this.subscription = LogStreamService.getInstance().LogObservable.subscribe(this.onEvent);
        LogStreamService.getInstance().sendEvent({ from: "Client", text: "Console connected to streaming service..." });
    }

    componentWillUnmount(): void {
        this.subscription?.unsubscribe();
    }

    updatePersistentState(): void {
        // Let the state finish updating
        setTimeout(() => {
            let persistentState: PersistentState = {...this.state};
            delete((persistentState as any).events);
            ls.set<PersistentState>(ConsoleComponent.PersistentStateKey, persistentState);
        });
    }

    private handleNavSelect(key: string | null) {
        if (key === "clear") {
            this.clearConsole();
            return;
        }
        if (key === "toggle-date-format") {
            this.setState({ humanReadableDates: !this.state.humanReadableDates });
            this.updatePersistentState();
        }
        if (key === "toggle-tail") {
            this.setState({ logTailing: !this.state.logTailing });
            this.updatePersistentState();
        }
        if (key === "all" || key === "server-only" || key === "client-only") {
            this.setState({ logFilter: key });
            this.updatePersistentState();
        }
    }

    private async notifyLogAdded() {
        if (!this.state.logNotification) {
            this.setState({logNotification: true});
            await Timer.immediateAwaitable(Duration.fromMilliseconds(500));
            this.setState({logNotification: false});
            this.updatePersistentState();
        }
    }

    private clearConsole() {
        this.setState({ events: [{ text: "Console cleared", from: "Client", dateTime: DateTime.now() }] });
    }

    private logFilter(value: LogEvent): boolean {
        if (this.state.logFilter === "all") return true;
        if (this.state.logFilter === "client-only" && value.from === "Client") return true;
        if (this.state.logFilter === "server-only" && value.from === "Server") return true;
        return false;
    }

    private onEvent(event: Readonly<LogEvent>) {
        this.setState({events: this.state.events.concat(event)});
        this.notifyLogAdded();
        if (this.state.logTailing) {
            setTimeout(() => {
                for (const element of document.getElementsByClassName("console-inner")) {
                    element.scrollTop = element.scrollHeight;
                }
            });
        }
    }

    private eventToLine(event: LogEvent, index: number) {
        return <span className="console-line" key={index}><span className="time">{this.state.humanReadableDates ? event.dateTime.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS) : event.dateTime.toISO()}</span> <span className={event.from === "Server" ? "server-message" : "client-message"}>{event.from === "Server" ? "Server" : "Client"}</span> &gt; {event.text}</span>
    }

    render(): JSX.Element {
        return (
            <div className="console h-100 mh-100">
                <Nav className="justify-content-end" variant="tabs" activeKey={this.state.logFilter} onSelect={this.handleNavSelect}>
                    <NavDropdown title="Toggles" id="nav-dropdown">
                        <NavDropdown.Item active={this.state.logTailing} eventKey="toggle-tail">Toggle Log Tailing</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item active={this.state.humanReadableDates} eventKey="toggle-date-format">Toggle Readable Dates</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Filters" id="nav-dropdown">
                        <NavDropdown.Item eventKey="all">All Logs</NavDropdown.Item>
                        <NavDropdown.Item eventKey="server-only">Server Logs</NavDropdown.Item>
                        <NavDropdown.Item eventKey="client-only">Client Logs</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Commands" id="nav-dropdown">
                        <NavDropdown.Item eventKey="clear">Clear</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <div className="background h-100 mh-100">
                    <div className={"console-inner h-100 mh-100 " + (this.state.logNotification ? "notify" : "")}>
                        <p className="console-text">
                            {this.state.events.filter(this.logFilter).map(this.eventToLine)}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}