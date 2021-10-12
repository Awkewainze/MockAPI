import * as React from "react";
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import { Route } from "shared";
import { PreviewCard } from "../route-cards/preview";
import "./style.scss";

interface IProps {
    routes: readonly Readonly<Route>[];
    routeOrderUpdated: (newRouteOrder: Route[]) => void;
    routeDeleted: (newRouteList: Route[]) => void;
    routeSelected: (route: Route) => void;
}

interface IState {
}

export class Chain extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }
    
    render(): JSX.Element {
        return (
            <div className="chain h-100 mh-100">
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {this.props.routes.map((route, index) => (
                                    <Draggable key={route.id} draggableId={route.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}>
                                                <PreviewCard route={route} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        )
    }

    onDragEnd(result: DropResult, provided: ResponderProvided) {
        // dropped outside the list
        if (!result.destination) {
          return;
        }

        this.props.routeOrderUpdated(this.reorder(this.props.routes, result.source.index, result.destination.index));
    }

    private reorder<T>(list: Readonly<Array<T>>, startIndex: number, endIndex: number): Array<T> {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }
}