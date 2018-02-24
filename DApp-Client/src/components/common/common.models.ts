export interface ISelectable {
    id: number,
    name: string
}


export class SelectOption implements ISelectable {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}   
