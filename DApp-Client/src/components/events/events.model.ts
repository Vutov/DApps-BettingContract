export interface IEventModel {
    address: string,
    homeTeam: string,
    awayTeam: string,
    isOpen: boolean
}

export interface IExtendedEventModel extends IEventModel {
    expireAt: string,
}

export class EventModel implements IEventModel {
    address: string;
    homeTeam: string;
    awayTeam: string;
    isOpen: boolean;

    constructor(address: string, homeTeam: string, awayTeam: string, isOpen: boolean) {
        this.address = address;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.isOpen = isOpen;
    }
}   

export class ExtendedEventModel implements IExtendedEventModel {
    address: string;
    homeTeam: string;
    awayTeam: string;
    isOpen: boolean;
    expireAt: string;

    constructor(address: string, homeTeam: string, awayTeam: string, isOpen: boolean, expireAt: string) {
        this.address = address;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.isOpen = isOpen;
        this.expireAt = expireAt;
    }
}   