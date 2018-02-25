import { get } from '../../services/requester';
import { exec } from '../../services/ethereumProvider';
import observer from '../../services/observer'
import { EventModel, IEventModel, ExtendedEventModel, IExtendedEventModel } from "./Events.model";

export class EventsBehavior {
    public getEvents(callback: Function) {
        get("event", "")
            .then((data) => {
                let mappedData: IEventModel[] = [];
                data.map(function (d) {
                    mappedData.push(new EventModel(
                        d.address,
                        d.homeTeamName,
                        d.awayTeamName,
                        d.isOpen
                    ));
                });

                callback(mappedData)
            });
    }

    public getEventInfo(address: string, callback: Function) {
        exec(address, 'getBetMetaInfo', [], function (data) {
            let exdpireAt = new Date(Number(data[3].toString()) * 1000).toLocaleString();
            let event = new ExtendedEventModel(address, data[1], data[2], data[0], exdpireAt);

            callback(event);
        });
    }
}