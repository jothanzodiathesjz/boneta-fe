export interface AuthInit {
  username: string;
  password: string;
}

export class DomainAuth {
  username: string;
  password: string;
  constructor(init: AuthInit) {
    this.username = init.username;
    this.password = init.password;
  }
}
