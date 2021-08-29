import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Route, RouteType } from "shared";
import { LogStreamService } from "../../services";
import { Chain } from "../chain";
import { ConsoleComponent } from "../console";
import { StaticCard } from "../route-cards/static";
import "./style.scss";

interface IProps {

}

interface IState {
    isSaving: boolean;
    routes: Route[];
}

export class Main extends React.PureComponent<IProps, IState> {
    private readonly logger = LogStreamService.getInstance();
    constructor(props: IProps) {
        super(props);
        this.state = {
            isSaving: false,
            routes: [
                { type: RouteType.Static, requestRequirements: { route: "/test1" } },
                { type: RouteType.Static, requestRequirements: { route: "/test2" } },
                { type: RouteType.Static, requestRequirements: { route: "/test3" } },
                { type: RouteType.Static, requestRequirements: { route: "/test4" } },
                { type: RouteType.Static, requestRequirements: { route: "/test5" } },
                { type: RouteType.Static, requestRequirements: { route: "/test6" } },
                { type: RouteType.Static, requestRequirements: { route: "/test7" } },
                { type: RouteType.Static, requestRequirements: { route: "/test8" } },
                { type: RouteType.Static, requestRequirements: { route: "/test9" } }
            ]
        };
    }

    private save() {
        this.setState({isSaving: true});
        this.logger.sendEvent({from: "Client", text: "Uploading configuration to server..."});
        setTimeout(() => {
            this.setState({isSaving: false});
            this.logger.sendEvent({from: "Server", text: "Configuration received"});
        }, 3000);
    }

    render(): JSX.Element {
        return (
            <Container fluid className="main h-100 mh-100">
                <Row className="main-row mh-75 h-75">
                    <Col md="9" className="mh-100 h-100">
                        <StaticCard routeInfo={({ type: RouteType.Static, statusCode: 200,  requestRequirements: { route: "/test" } })} ></StaticCard>
                    </Col>
                    <Col md="3" className="mh-100 h-100">
                        <Button disabled={this.state.isSaving} onClick={this.save.bind(this)}>
                            {this.state.isSaving ? <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"/> :
                            <FontAwesomeIcon icon={faCloudUploadAlt} aria-label="Save" />}
                        </Button>
                        <Chain routes={this.state.routes} routeOrderUpdated={() => {}} routeSelected={() => {}} routeDeleted={() => {}} />
                    </Col>
                </Row>
                <Row className="console-row mh-25 h-25">
                    <Col className="mh-100 h-100" md="12">
                        <ConsoleComponent streamingService={this.logger}/>
                    </Col>
                </Row>
            </Container>
        );
    }
}