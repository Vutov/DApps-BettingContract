import { get, post } from '../../services/requester';
import observer from '../../services/observer'
import { exec } from '../../services/ethereumProvider'
import { getAddress, getFromWei } from '../../services/ethereumProvider'
import { BetModel, IBetModel, BetDetails } from "./history.model";

export class HistoryBehavior {
    public getBets(callback: Function) {
        let address = getAddress();
        get("event", "bets/" + address)
            .then((data) => {
                let mappedData: IBetModel[] = [];
                data.map(function (d) {
                    mappedData.push(new BetModel(
                        d.address,
                        d.title,
                    ));
                });

                callback(mappedData)
            });
    }

    public getBetsDetails(address: string, callback: Function) {
        exec(address, 'getBetMetaInfo', [], function (betInfo) {
            let details = new BetDetails('0', '0', '0', null, '0', !betInfo[0]);
            let senderAddress = getAddress();

            exec(address, 'getBets', [senderAddress], function (betsData) {
                details.betOnHome = getFromWei(betsData[0].toString(), 'ether').toString();
                details.betOnAway = getFromWei(betsData[1].toString(), 'ether').toString();
                details.betOnDraw = getFromWei(betsData[2].toString(), 'ether').toString();

                if (details.isSettled == false) {
                    callback(details);
                    return;
                }

                exec(address, 'getWinner', [], function (winnerData) {
                    let winner = Number(winnerData.toString());
                    if (winner == 3) {
                        details.winner = "Draw";
                    } else {
                        details.winner = betInfo[winner]; // return data isOpen 0, home 1, away 2
                    }

                    exec(address, 'getWinnings', [], function (winningsData) {
                        details.winnings = getFromWei(winningsData.toString(), 'ether').toString();

                        callback(details);
                    });
                });
            });
        });
    }

    public collect(address: string, callback: Function) {
        exec(address, 'collectWinnigs', [], callback)
    }
}