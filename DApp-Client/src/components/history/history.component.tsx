import * as React from 'react'
import observer from '../../services/observer'
import { HistoryBehavior } from './history.behavior'
import { IBetModel, IBetDetails } from "./history.model";
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

    componentDidMount() {
        this.behavior.getBets(function (data: Array<IBetModel>) {
            this.setState({ bets: data });
        }.bind(this));
    }

    expand(address: string) {
        this.setState({
            selectedRow: address
        });

        this.behavior.getBetsDetails(address, function (data: IBetDetails) {
            this.setState({
                details: data
            });
        }.bind(this));
    }

    collectMoney() {
        this.behavior.collect(this.state.selectedRow, function () {
            observer.showSuccess(this.state.details.winnings + " Ether collected!");
            this.state.details.winnings = '0';
        }.bind(this));
    }

    buildDetails() {
        let details = this.state.details as IBetDetails
        if (!details) {
            return null;
        }

        let Winnings = null;
        if (details.isSettled) {
            let Button = null;
            let className = 'label-danger';
            if (details.winnings !== '0') {
                className = 'label-success';
                Button = <input type="button" value='Collect Winnigs' className='mt-1 btn btn-default' onClick={this.collectMoney.bind(this)} />
            }

            Winnings = (<div className='row mt-1'>
                <div className='col-xs-6'>
                    {Button}
                </div>
                <div className={'col-xs-6 mt-1 label ' + className}>Winnings {details.winnings} Ethers</div>
            </div>)
        }

        return (<div>
            <div className='row mt-1'>
                <div className='col-xs-6'>Winner:</div>
                <div className='col-xs-6 label label-success'>{details.winner}</div>
            </div>
            <div className='row mt-1'>
                <div className='col-xs-6'>Bets on home team:</div>
                <div className='col-xs-6'>{details.betOnHome} Ethers</div>
            </div>
            <div className='row mt-1'>
                <div className='col-xs-6'>Bets on away team:</div>
                <div className='col-xs-6'>{details.betOnAway} Ethers</div>
            </div>
            <div className='row mt-1'>
                <div className='col-xs-6'>Bets on draw:</div>
                <div className='col-xs-6'>{details.betOnDraw} Ethers</div>
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