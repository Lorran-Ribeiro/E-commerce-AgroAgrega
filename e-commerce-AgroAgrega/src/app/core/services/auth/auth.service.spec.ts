import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi } from 'vitest';
import { Auth } from './auth.service';
import { StorageService } from './storage.service';
import { TokenAuth } from './token.service';
import { SHA256 } from 'crypto-js';
import { UserModel } from '@models/user';

describe('Teste de autenticação', () => {
  it('Deve retornar true se login for efetuado com sucesso', () => {
    const user: UserModel = {
      id: '1',
      name: 'John',
      email: 'john@email.com',
      password: SHA256('123456').toString(),
    }; // Cria uma varíavel de usuário

    const storageMock = {
      getUser: vi.fn().mockReturnValue(user),
    }; // Cria um storage falso para o teste
                          // ambos são necessários para o Auth, já que são utilizados no login
    const tokenMock = {
      getId: vi.fn().mockReturnValue(''),
      checkToken: vi.fn().mockReturnValue(false),
      setToken: vi.fn(),
    }; // Cria um token falso para o teste

    TestBed.configureTestingModule({
      providers: [
        Auth,
        { provide: StorageService, useValue: storageMock },
        { provide: TokenAuth, useValue: tokenMock },
      ],
    });

    const auth = TestBed.inject(Auth);

    const result = auth.login('john@email.com', '123456');

    expect(result).toBe(true);
  });
});