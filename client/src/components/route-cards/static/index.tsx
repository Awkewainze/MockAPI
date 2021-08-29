import * as React from "react";
import { Button, Card } from "react-bootstrap";
import { StaticRoute, StatusCode } from "shared";
import "./style.scss";

interface IProps {
    routeInfo: StaticRoute;
}

interface IState {

}

export class StaticCard extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {};
    }

    onDelete() {
        console.log("deleted");
    }

    render(): JSX.Element {
        return (
        <Card>
            <Card.Body>
                <Card.Title>Static - {this.props.routeInfo.requestRequirements.method ?? "ALL"} {this.props.routeInfo.requestRequirements.route}</Card.Title>
                <Card.Text>
                    {this.props.routeInfo.statusCode} {StatusCode[this.props.routeInfo.statusCode ?? 200]}
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <Button variant="danger" size="sm" onClick={this.onDelete.bind(this)}>Delete</Button>
            </Card.Footer>
        </Card>);
    }
}