type CategoryInit = {
    uuid: string;
    name: string;
};

export class DomainCategory implements CategoryInit {

    uuid: string;
    name:string

    constructor(data: CategoryInit) {
        this.uuid = data.uuid
        this.name = data.name
    }

}