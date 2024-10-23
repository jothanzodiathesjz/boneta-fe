export interface ProfileInit {
  firstName: string;
  lastName: string;
  age: number;
  address: string;
}

export class DomainProfile {
  firstName: string;
  lastName: string;
  age: number;
  address: string;

  constructor(init: ProfileInit) {
    this.firstName = init.firstName;
    this.lastName = init.lastName;
    this.age = init.age;
    this.address = init.address;
  }
}

export interface UserInit {
  uuid: string;
  username: string;
  full_name: string;
  email: string;
  roles: string[];
  phone?: string;
}

export class DomainUser {
  uuid: string;
  username: string;
  full_name: string;
  email: string;
  roles: string[];
  phone?: string;

  constructor(init: UserInit) {
    this.uuid = init.uuid;
    this.username = init.username;
    this.full_name = init.full_name;
    this.email = init.email;
    this.roles = init.roles;
    this.phone = init.phone;
  }
}

export interface UserWithProfileInit extends UserInit {
  profile: ProfileInit;
}

export class DomainUserWithProfile extends DomainUser {
  profile: DomainProfile;

  constructor(init: UserWithProfileInit) {
    super(init);
    this.profile = new DomainProfile(init.profile);
  }
}

export interface UserWithPasswordInit extends UserInit {
  password: string;
}
