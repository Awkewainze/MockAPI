import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import { Route } from "shared";
import "./style.scss";

interface IProps {
    route: Route;
}

interface IState {

}

export class PreviewCard extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {};
        this.onModify = this.onModify.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onDelete() {

    }

    onModify() {

    }

    render(): JSX.Element {
        return (
        <Card>
            <Card.Body>
                <Card.Title>Static - {this.props.route.requestRequirements.method ?? ""} {this.props.route.requestRequirements.route}</Card.Title>
                <Card.Text>
                    {this.props.route.type}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-start">
                <ButtonGroup>
                    <Button variant="primary" size="sm" onClick={this.onModify}><FontAwesomeIcon icon={faEdit} aria-label="Edit"/></Button>
                    <Button variant="danger" size="sm" onClick={this.onDelete}><FontAwesomeIcon icon={faTrash} aria-label="Delete"/></Button>
                </ButtonGroup>
            </Card.Footer>
        </Card>);
    }
}