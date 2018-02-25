export interface IBetModel {
    address: string,
    title: string
}

export interface IBetDetails {
    betOnHome: string;
    betOnAway: string;
    betOnDraw: string;
    winner: string;
    winnings: string;
    isSettled: boolean;
}

export class BetModel implements IBetModel {
    address: string;
    title: string;

    constructor(address: string, title: string) {
        this.address = address;
        this.title = title;
    }
}   

export class BetDetails implements IBetDetails {
    betOnHome: string;
    betOnAway: string;
    betOnDraw: string;
    winner: string;
    winnings: string;
    isSettled: boolean;

    constructor(betOnHome: string, betOnAway: string, betOnDraw: string, winner: string, winnings: string, isSettled: boolean) {
        this.betOnHome = betOnHome;
        this.betOnAway = betOnAway;
        this.betOnDraw = betOnDraw;
        this.winner = winner;
        this.winnings = winnings;
        this.isSettled = isSettled;
    }
}