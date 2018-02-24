import { RouteComponentProps } from "react-router";
import { IEventModel } from "./events.model";

export interface EventsGridProps extends RouteComponentProps<any> {
    events: Array<IEventModel>
}