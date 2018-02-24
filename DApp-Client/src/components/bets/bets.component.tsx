import * as React from 'react'
import { BetsBehavior } from "./bets.behavior";
import { EventsBehavior } from "../events/events.behavior";
import { IExtendedEventModel } from "../events/events.model";
import { IPlacedBet } from "./bets.model";
import { Button } from 'react-bootstrap'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import { ISelectable, SelectOption } from '../common/common.models';
import { getMoneyTypes } from "../../services/ethereumProvider"
import observer from "../../services/observer"

export class BetsComponent extends React.Component<any, any> {

    constructor(props) {
        super(props);

        this.state = {
            event: {},
            amount: 0,
            winner: 1,
            type: "ether",
            possibleWinnig: null
        }
    }

    private behavior: BetsBehavior = new BetsBehavior()
    private eventBehavior: EventsBehavior = new EventsBehavior()

    componentDidMount() {
        this.eventBehavior.getEventInfo(this.props.match.params.address, function (data: IExtendedEventModel) {
            this.setState({ event: data });
        }.bind(this));
    }

    onChangeHandler(event) {
        let data = { possibleWinnig: null };
        data[event.target.name] = event.target.value
        this.setState(data);
    }

    onSubmitHandler(event) {
        event.preventDefault();
        let address = this.props.match.params.address;
        this.behavior.placeBet(address, this.state.winner, this.state.amount, this.state.type, function (data) {
            observer.showSuccess("Bet placed!")
        }.bind(this));
    }

    checkWinnigs() {
        let address = this.props.match.params.address;
        this.behavior.checkPossibleWinnings(address, this.state.winner, this.state.amount, this.state.type, function (data) {
            this.setState({ possibleWinnig: data });
        }.bind(this));
    }

    displayPossibleWinnings() {
        let Div = null;
        if (this.state.possibleWinnig) {
            if (this.state.possibleWinnig === "0") {
                return <div>
                    <span>You can get back </span>
                    <span className="label label-success">{this.state.amount + " " + this.state.type}</span>
                    <span> with this bet. Perhaps there are no other bets or the amount is too small.</span>
                </div>
            } else {
                return <div>
                    <span>You can win </span>
                    <span className="label label-success">{this.state.possibleWinnig + " " + this.state.type}</span>
                </div>
            }
        }

        return null;
    }

    render() {
        let event = this.state.event as IExtendedEventModel;
        let options = new Array<ISelectable>();
        options.push(new SelectOption(3, "Draw"));
        options.push(new SelectOption(1, event.homeTeam));
        options.push(new SelectOption(2, event.awayTeam));

        return (
            <section>
                <div className='container'>
                    <h1 className='lead'>Event Info:</h1>
                    <div className='form-group'>
                        <div>Home Team: </div>
                        <div>{event.homeTeam}</div>
                    </div>
                    <div className='form-group'>
                        <div>Away Team: </div>
                        <div>{event.awayTeam}</div>
                    </div>

                    <h2 className='lead'>Place Bet</h2>
                    <form onSubmit={this.onSubmitHandler.bind(this)}>
                        <FormGroup>
                            <ControlLabel>{"Winner"}</ControlLabel>
                            <FormControl componentClass="select" placeholder={"Winner"} name={"winner"} onChange={this.onChangeHandler.bind(this)}>
                                {
                                    options.map(function (e: ISelectable) {
                                        return <option key={e.id} value={e.id}>{e.name}</option>
                                    }.bind(this))
                                }
                            </FormControl>
                        </FormGroup>

                        <FormGroup controlId={"amount"}>
                            <div className="row">
                                <div className="col-xs-12">
                                    <ControlLabel>Amount</ControlLabel>
                                </div>
                                <div className="col-xs-8">
                                    <FormControl
                                        id="amount"
                                        type="number"
                                        placeholder="Amount"
                                        name="amount"
                                        required
                                        onChange={this.onChangeHandler.bind(this)}
                                        min="1">
                                    </FormControl>
                                </div>
                                <div className="col-xs-4">
                                    <FormControl componentClass="select" placeholder={"type"} name={"type"} onChange={this.onChangeHandler.bind(this)}>
                                        {
                                            getMoneyTypes().map(function (e) {
                                                return <option key={e} value={e}>{e}</option>
                                            }.bind(this))
                                        }
                                    </FormControl>
                                </div>
                            </div>
                        </FormGroup>
                        <div className="row">
                            <div className="col-xs-4"><Button type='submit'>Place bet</Button>
                                <input type="button" className="btn btn-warning ml-1" value="Check possible winnings" onClick={this.checkWinnigs.bind(this)} />
                            </div>
                            <div className="col-xs-8 p-10">
                                {this.displayPossibleWinnings()}
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        )
    }
}