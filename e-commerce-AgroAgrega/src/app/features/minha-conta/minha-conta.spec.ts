import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AddressService } from '@core/services/address/address.service';
import { Auth } from '@core/services/auth/auth.service';
import { CepService } from '@core/services/cep/cep';
import { OrderService } from '@core/services/order/order.service';

import { MinhaConta } from './minha-conta';

describe('MinhaConta', () => {
  let component: MinhaConta;
  let fixture: ComponentFixture<MinhaConta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhaConta],
      providers: [
        provideRouter([]),
        {
          provide: Auth,
          useValue: {
            currentUserId: signal(null),
            getName: () => 'Usuário Teste',
            getEmail: () => 'usuario@email.com',
            getId: () => 'user-1',
            updateProfile: () => ({ res: true, message: '' }),
            logout: () => undefined,
            removeAccount: () => true,
          },
        },
        {
          provide: OrderService,
          useValue: {
            getOrdersByUserId: () => [],
          },
        },
        {
          provide: AddressService,
          useValue: {
            getAddresses: () => [],
            saveAddresses: () => undefined,
          },
        },
        {
          provide: CepService,
          useValue: {
            getCep: () => ({ subscribe: () => undefined }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MinhaConta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
