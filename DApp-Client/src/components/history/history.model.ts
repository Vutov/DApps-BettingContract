export interface IBetModel {
    address: string,
    title: string
}

export class BetModel implements IBetModel {
    address: string;
    title: string;

    constructor(address: string, title: string) {
        this.address = address;
        this.title = title;
    }
}   