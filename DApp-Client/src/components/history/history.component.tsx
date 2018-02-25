import * as React from 'react'
import { HistoryBehavior } from './history.behavior'
import { EventsBehavior } from '../events/events.behavior'
import { IBetModel } from "./history.model";
import { IEventModel } from "../events/events.model";
import { Formatter } from "../common/formatters";
import { Table, Pager } from 'react-bootstrap'

export class HistoryComponent extends React.Component<any, any> {

    constructor() {
        super();

        this.state = {
            bets: [],
            details: null,
            selectedRow: ''
        }
    }

    private behavior: HistoryBehavior = new HistoryBehavior()
    private eventBehavior: EventsBehavior = new EventsBehavior()

    componentDidMount() {
        this.behavior.getBets(function (data: Array<IBetModel>) {
            this.setState({ bets: data });
        }.bind(this));
    }

    expand(address: string) {
        this.setState({
            selectedRow: address,
            details: {
                betOnHome: 10000,
                betOnAway: 100,
                betOnDraw: 100,
                winner: 'Arsenal',
                winnings: '0',
                isSettled: true
            }
        });
    }

    buildDetails() {
        if (!this.state.details) {
            return null;
        }

        let Winnings = null;
        if (this.state.details.isSettled) {
            let Button = null;
            let className = 'label-danger';
            if ( this.state.details.winnings !== '0') {
                className = 'label-success';
                Button = <input type="button" value='Collect Winnigs' className='mt-1 btn btn-default' />
            }

            Winnings = (<div className='row mt-1'>
                <div className='col-xs-6'>
                    {Button}
                </div>
                <div className={'col-xs-6 mt-1 label ' + className}>Winnings {this.state.details.winnings} Ethers</div>
            </div>)
        }

        return (<div>
            <div className='row mt-1'>
                <div className='col-xs-6'>Winner:</div>
                <div className='col-xs-6 label label-success'>{this.state.details.winner} Ethers</div>
            </div>
            <div className='row mt-1'>
                <div className='col-xs-6'>Bets on home team:</div>
                <div className='col-xs-6'>{this.state.details.betOnHome} Ethers</div>
            </div>
            <div className='row mt-1'>
                <div className='col-xs-6'>Bets on away team:</div>
                <div className='col-xs-6'>{this.state.details.betOnAway} Ethers</div>
            </div>
            <div className='row mt-1'>
                <div className='col-xs-6'>Bets on draw:</div>
                <div className='col-xs-6'>{this.state.details.betOnDraw} Ethers</div>
            </div>
            {Winnings}
        </div>)
    }

    render() {
        return (
            <section>
                <div className='col-xs-8'>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Address</th>
                                <th>Event</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (this.state.bets || []).map(function (e: IBetModel) {
                                    let linkRopsten = 'https://ropsten.etherscan.io/address/' + e.address;

                                    return (
                                        <tr className={this.state.selectedRow == e.address ? 'clickable-row cursor active' : 'clickable-row cursor'} key={e.address} onClick={this.expand.bind(this, e.address)}>
                                            <td>
                                                <a href={linkRopsten}>{e.address}</a>
                                            </td>
                                            <td>{e.title}</td>
                                        </tr>
                                    )
                                }.bind(this))
                            }
                        </tbody>
                    </Table>
                </div>
                <div className='col-xs-4'>
                    <h1 className='text-center'>Details</h1>
                    {this.buildDetails.call(this)}
                </div>
            </section>
        )
    }
}