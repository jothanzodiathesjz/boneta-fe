import { DomainCategory } from "./Category";

  
export type MenuItemInit = {
    uuid:string;
    name: string;
    price: number;
    availability: boolean;
    image: string;
    category?: DomainCategory;
  };



export class DomainMenu {
    uuid: string;
    name: string;
    price: number;
    availability: boolean;
    image: string;
    category?: DomainCategory;

    constructor(data: MenuItemInit) {
        this.uuid = data.uuid
        this.name = data.name
        this.price = data.price
        this.availability = data.availability
        this.image = data.image
        this.category = data.category
    }
   
    static toDomain(data: MenuItemInit,file:File) {
        return {
            ...data,
            file: file
        }
    }
}