import { faCloudUploadAlt, faFolderOpen, faPlusCircle, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Button, ButtonGroup, Col, Container, Row, Spinner } from "react-bootstrap";
import { Route, RouteType } from "shared";
import { LogStreamService } from "../../services";
import { Chain } from "../chain";
import { ConsoleComponent } from "../console";
import { EditCard } from "../edit-card";
import "./style.scss";

interface IProps {

}

interface IState {
    isSaving: boolean;
    routes: readonly Readonly<Route>[];
}

export class Main extends React.PureComponent<IProps, IState> {
    private readonly logger = LogStreamService.getInstance();
    constructor(props: IProps) {
        super(props);
        this.state = {
            isSaving: false,
            routes: [
                { id: "a", type: RouteType.Static, requestRequirements: { route: "/test1" } },
                { id: "b", type: RouteType.Static, requestRequirements: { route: "/test2" } },
                { id: "c", type: RouteType.Static, requestRequirements: { route: "/test3" } },
                { id: "d", type: RouteType.Static, requestRequirements: { route: "/test4" } },
                { id: "e", type: RouteType.Static, requestRequirements: { route: "/test5" } },
                { id: "f", type: RouteType.Static, requestRequirements: { route: "/test6" } },
                { id: "g", type: RouteType.Static, requestRequirements: { route: "/test7" } },
                { id: "h", type: RouteType.Static, requestRequirements: { route: "/test8" } },
                { id: "i", type: RouteType.Static, requestRequirements: { route: "/test9" } }
            ]
        };
        this.save = this.save.bind(this);
        this.routeOrderUpdated = this.routeOrderUpdated.bind(this);
    }

    private save() {
        this.setState({isSaving: true});
        this.logger.sendEvent({from: "Client", text: "Uploading configuration to server..."});
        setTimeout(() => {
            this.setState({isSaving: false});
            this.logger.sendEvent({from: "Server", text: "Configuration received"});
        }, 3000);
    }

    private routeOrderUpdated(routes: Route[]) {
        this.setState({ routes });
    }

    render(): JSX.Element {
        return (
            <Container fluid className="main h-100 mh-100">
                <Row className="main-row mh-75 h-75">
                    <Col md="9" className="mh-100 h-100">
                        <EditCard selectedCard={this.state.routes[0]}></EditCard>
                    </Col>
                    <Col md="3" className="chain-and-controls">
                        <ButtonGroup className="chain-controls w-100">
                            <Button variant="outline-primary"><FontAwesomeIcon icon={faPlusCircle} aria-label="Save"/></Button>
                            <Button variant="outline-primary" disabled={this.state.isSaving} onClick={this.save}>
                                {this.state.isSaving ?
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"/>
                                    : <FontAwesomeIcon icon={faCloudUploadAlt} aria-label="Upload configuration" />}
                            </Button>
                            <Button variant="outline-info"><FontAwesomeIcon icon={faSave} aria-label="Save"/></Button>
                            <Button variant="outline-info"><FontAwesomeIcon icon={faFolderOpen} aria-label="Load"/></Button>
                            <Button variant="outline-danger"><FontAwesomeIcon icon={faTrash} aria-label="Clear"/></Button>
                        </ButtonGroup>
                        <Chain routes={this.state.routes} routeOrderUpdated={this.routeOrderUpdated} routeSelected={() => {}} routeDeleted={() => {}} />
                    </Col>
                </Row>
                <Row className="console-row mh-25 h-25">
                    <Col className="mh-100 h-100" md="12">
                        <ConsoleComponent/>
                    </Col>
                </Row>
            </Container>
        );
    }
}