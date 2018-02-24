import * as React from 'react'
import { Link } from 'react-router-dom';
import { EventsGridProps } from './events-grid.model'
import { IEventModel } from "./events.model";
import { Table } from 'react-bootstrap'

export class EventsGridComponent extends React.Component<EventsGridProps, any> {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className='container'>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th>Home Team Name</th>
                            <th>Away Team Name</th>
                            <th>Bet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (this.props.events || []).map(function (e: IEventModel) {
                                let linkRopsten = 'https://ropsten.etherscan.io/address/' + e.address;
                                let linkBet = 'bet/' + e.address;
                                if (e.isOpen) {
                                    return (
                                        <tr key={e.address}>
                                            <td>
                                                <a href={linkRopsten}>{e.address}</a>
                                            </td>
                                            <td>{e.homeTeam}</td>
                                            <td>{e.awayTeam}</td>
                                            <td>
                                                <Link to={linkBet}>Place a bet</Link>
                                            </td>
                                        </tr>
                                    )
                                }
                            })
                        }
                    </tbody>
                </Table>
            </section>
        )
    }
}