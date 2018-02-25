import { get, post } from '../../services/requester';
import observer from '../../services/observer'
import { getAddress } from '../../services/ethereumProvider'
import { BetModel, IBetModel } from "./history.model";

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
}