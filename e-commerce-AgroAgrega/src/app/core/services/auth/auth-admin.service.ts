import { Injectable } from '@angular/core';
import UserDb from '@mocks/users.json';

@Injectable({ providedIn: 'root' })
export class AuthAdminService {
  public isLoggedIn: boolean = false;

  LoginAdmin(usuario: string, senha: string): boolean {
    return Object.values(UserDb).every(user => {
      this.isLoggedIn = user.name === usuario && user.password === senha
      ? true : false;

      return this.isLoggedIn;
    });
  }
}
