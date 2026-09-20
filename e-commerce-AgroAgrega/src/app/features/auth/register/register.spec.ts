import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Register } from './register';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
//   const authMock = {
//     register: vi.fn(),
//   };

//   const routerMock = {
//     url: '/register',
//     navigateByUrl: vi.fn(),
//   };

//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   async function setup() {
//     return render(Register, {
//       providers: [
//         {
//           provide: Auth,
//           useValue: authMock,
//         },
//         {
//           provide: Router,
//           useValue: routerMock,
//         },
//       ],
//     });
//   }

//   it('Deve renderez the registration form', async () => {
//     await setup();

//     expect(
//       screen.getByLabelText('Nome completo'),
//     ).toBeInTheDocument();

//     expect(
//       screen.getByLabelText('E-mail'),
//     ).toBeInTheDocument();

//     expect(
//       screen.getByLabelText('Senha'),
//     ).toBeInTheDocument();

//     expect(
//       screen.getByLabelText('Confirme sua senha'),
//     ).toBeInTheDocument();

//     expect(
//       screen.getByRole('checkbox'),
//     ).toBeInTheDocument();

//     expect(
//       screen.getByRole('button', {
//         name: /criar minha conta/i,
//       }),
//     ).toBeInTheDocument();
//   });

//   it('should register with valid data', async () => {
//     const user = userEvent.setup();

//     authMock.register.mockReturnValue({
//       res: true,
//       message: '',
//     });

//     await setup();

//     await user.type(
//       screen.getByLabelText('Nome completo'),
//       'João da Silva',
//     );

//     await user.type(
//       screen.getByLabelText('E-mail'),
//       'joao@email.com',
//     );

//     await user.type(
//       screen.getByLabelText('Senha'),
//       '123456',
//     );

//     await user.type(
//       screen.getByLabelText('Confirme sua senha'),
//       '123456',
//     );

//     await user.click(
//       screen.getByRole('checkbox'),
//     );

//     const submitButton = screen.getByRole(
//       'button',
//       {
//         name: /criar minha conta/i,
//       },
//     );

//     expect(submitButton).toBeEnabled();

//     await user.click(submitButton);

//     expect(authMock.register).toHaveBeenCalledOnce();

//     expect(authMock.register).toHaveBeenCalledWith(
//       'João da Silva',
//       'joao@email.com',
//       '123456',
//     );

//     expect(
//       routerMock.navigateByUrl,
//     ).toHaveBeenCalledWith('/login');
//   });
// });
