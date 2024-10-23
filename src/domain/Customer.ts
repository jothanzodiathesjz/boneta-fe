export interface CustomerInit {
  name: string;
  email: string;
  phone: string;
  address: string;
  uuid: string;
  location?: string;
}

export class DomainCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  uuid: string;
  location?: string;

  constructor(init: CustomerInit) {
    this.name = init.name;
    this.email = init.email;
    this.phone = init.phone;
    this.address = init.address;
    this.uuid = init.uuid;
    this.location = init.location;
  }
}
