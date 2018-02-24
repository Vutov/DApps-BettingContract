import * as React from 'react'
import { EventsBehavior } from './events.behavior'
import { EventsGridComponent } from './events-grid.components'
import { IEventModel } from "./events.model";

export class EventsComponent extends React.Component<any, any> {

    constructor(props) {
        super(props);

        this.state = {
            events: []
        }
    }

    private behavior: EventsBehavior = new EventsBehavior()

    componentDidMount() {
        this.updateGrid()
    }

    updateGrid(){
         this.behavior.getEvents(function (data: Array<IEventModel>) {
            this.setState({ events: data });
        }.bind(this));
    }

    render() {
        return (
            <section className='container'>
                <h2 className='lead padding-top-20'>All Events</h2>
                <EventsGridComponent
                    events={this.state.events}
                    history={this.state.history}
                    location={this.state.location}
                    match={this.state.match}
                />
            </section>
        )
    }
}