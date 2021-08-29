import { DateTime } from "luxon";
import * as React from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { LogEvent, LogStreamService } from "../../services";
import "./style.scss";

interface IProps {
    streamingService: LogStreamService;
}

interface IState {
    events: Array<LogEvent>;
    scrollToBottom: boolean;
    logFilter: "all" | "client-only" | "server-only";
    humanReadableDates: boolean;
}

export class ConsoleComponent extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            events: [],
            scrollToBottom: true,
            logFilter: "all",
            humanReadableDates: false
        };
    }

    private listener: ((event: LogEvent) => void) | null = null;
    componentDidMount(): void {
        this.listener = this.props.streamingService.listen(this.onEvent.bind(this));
        this.props.streamingService.sendEvent({ from: "Client", text: "Console connected to streaming service..." });
    }

    componentWillUnmount(): void {
        if (this.listener !== null) {
            this.props.streamingService.removerListener(this.listener);
            this.listener = null;
        }
    }

    private handleNavSelect(key: string | null) {
        if (key === "clear") {
            this.clearConsole();
            return;
        }
        if (key === "toggle-date-format") {
            this.setState({ humanReadableDates: !this.state.humanReadableDates });
        }
        if (key === "toggle-tail") {
            this.setState({ scrollToBottom: !this.state.scrollToBottom });
        }
        if (key === "all" || key === "server-only" || key === "client-only") {
            this.setState({ logFilter: key });
            return;
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

    private onEvent(event: LogEvent) {
        this.setState({events: this.state.events.concat(event)});
        if (this.state.scrollToBottom) {
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
                <Nav className="justify-content-end" variant="tabs" activeKey={this.state.logFilter} onSelect={this.handleNavSelect.bind(this)}>
                    <NavDropdown title="Toggles" id="nav-dropdown">
                        <NavDropdown.Item active={this.state.scrollToBottom} eventKey="toggle-tail">Toggle Log Tailing</NavDropdown.Item>
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
                    <div className="console-inner h-100 mh-100">
                        <p className="console-text">
                            {this.state.events.filter(this.logFilter.bind(this)).map(this.eventToLine.bind(this))}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}