import * as React from "react";
import { Button, Card, Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Route } from "shared";
import "./style.scss";

interface IProps {
    selectedCard: Readonly<Route>;
}

interface IState {
    route: Route;
}

export class EditCard extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            route: {...this.props.selectedCard}
        };
        this.getTitle = this.getTitle.bind(this);
        this.onSelectCardType = this.onSelectCardType.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }

    private getTitle(): string {
        return this.state.route.name ?? `${this.state.route.type} - ${this.state.route.requestRequirements.method ?? "ALL"} ${this.state.route.requestRequirements.route}`;
    }

    private onSelectCardType(select: React.ChangeEvent<HTMLSelectElement>): void {
        console.log(select.target.value);
    }

    private saveChanges(): void {

    }

    render(): JSX.Element {
        return (
            <Card className="edit-card">
                <Card.Body>
                    <Card.Title>{this.getTitle()}</Card.Title>
                    <Card.Text>
                        <Form>
                            <Row>
                                <Form.Group as={Col} className="mb-3">
                                    <OverlayTrigger placement="right" overlay={<Tooltip id="nickname-tooltip">Display name for card, does not modify functionality</Tooltip>}>
                                        <Form.Label>Nickname</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control type="route-name" placeholder="Route name"></Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <OverlayTrigger placement="right" overlay={<Tooltip id="route-type-tooltip">How this route will handle a request</Tooltip>}>
                                        <Form.Label>Route type</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Select aria-label="Select Card Type" onChange={this.onSelectCardType}>
                                        <option value="Static">Static</option>
                                        <option value="Delay">Delay</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <OverlayTrigger placement="right" overlay={<Tooltip id="id-tooltip">Internal id for route</Tooltip>}>
                                        <Form.Label>Route id</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control type="route-id" value={this.state.route.id} readOnly />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} className="mb-3">
                                    <OverlayTrigger placement="right" overlay={<Tooltip id="route-path-tooltip">Route path handled by this link, Regex</Tooltip>}>
                                        <Form.Label>Route path</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control type="route-path" placeholder="/example/.*"></Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <OverlayTrigger placement="right" overlay={<Tooltip id="route-method-tooltip">Methods handled by this link</Tooltip>}>
                                        <Form.Label>Method</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Select aria-label="Select method" onChange={this.onSelectCardType}>
                                        <option value="ALL">ALL</option>
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                        <option value="PATCH">PATCH</option>
                                        <option value="DELETE">DELETE</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <OverlayTrigger placement="right" overlay={<Tooltip id="route-skip-tooltip">Skip this number of interactions with this route</Tooltip>}>
                                        <Form.Label>Skip</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control type="route-skip" placeholder="0"></Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <OverlayTrigger placement="right" overlay={<Tooltip id="route-take-tooltip">Take this number of interactions with this route</Tooltip>}>
                                        <Form.Label>Take</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control type="route-take" placeholder="10"></Form.Control>
                                </Form.Group>
                            </Row>
                        </Form>
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Button variant="primary" size="lg" onClick={this.saveChanges}>Save</Button>
                </Card.Footer>
            </Card>
        )
    }
}
