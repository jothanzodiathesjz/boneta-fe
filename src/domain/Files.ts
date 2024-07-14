export interface FileInit {
    name: string
    url: string
}

export class DomainFile {
    name: string
    url: string

    constructor(init: FileInit) {
        this.name = init.name
        this.url = init.url
    }
}