import { post } from '../../services/requester';
import observer from '../../services/observer';
import { exec, transaction, getFromWei, getWei } from '../../services/ethereumProvider';

export class BetsBehavior {
    checkPossibleWinnings(address: string, winner: number, amount: string, type: string, callback: Function) {
        let money = getWei(amount, type);
        exec(address, 'getPossibleWinnig', [winner, money], function(data) {
            callback(getFromWei(data.toString(), type).toString());
        })
    }

    placeBet(address: string, winner: number, amount: string, type: string, callback: Function) {
        let money = getWei(amount, type);
        transaction(address, 'bet', money, [winner], function(data, customerAddress) {
            post('event', 'bet', {eventAddress: address, customerAddress: customerAddress })

            callback(getFromWei(data.toString()).toString());
        })
    }
}