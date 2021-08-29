import * as React from "react";
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import { Route } from "shared";
import { PreviewCard } from "../route-cards/preview";
import "./style.scss";

interface IProps {
    routes: Route[];
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
    }
    
    render(): JSX.Element {
        return (
            <div className="chain h-100 mh-100">
                <DragDropContext  onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        >
                        {this.props.routes.map((route, index) => (
                            <Draggable key={index} draggableId={route.requestRequirements.route} index={index}>
                            {(provided, snapshot) => (
                                <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                    <PreviewCard routeInfo={route} />
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

        console.log("source", result.source);
        console.log("destination", result.destination);
      }
    
}