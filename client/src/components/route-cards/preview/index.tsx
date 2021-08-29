import * as React from "react";
import { Button, Card } from "react-bootstrap";
import { Route } from "shared";
import "./style.scss";

interface IProps {
    routeInfo: Route;
}

interface IState {

}

export class PreviewCard extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {};
    }

    onDelete() {
        
    }

    render(): JSX.Element {
        return (
        <Card>
            <Card.Body>
                <Card.Title>Static - {this.props.routeInfo.requestRequirements.method ?? ""} {this.props.routeInfo.requestRequirements.route}</Card.Title>
                <Card.Text>
                    {this.props.routeInfo.type}
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <Button variant="danger" size="sm" onClick={this.onDelete.bind(this)}>Delete</Button>
            </Card.Footer>
        </Card>);
    }
}