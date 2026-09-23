import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { TokenAuth } from './token.service';

describe('TokenAuth', () => {
  let service: TokenAuth;

  beforeEach(() => {
    localStorage.clear();
    document.cookie = 'auth_token=; max-age=0; path=/';
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenAuth);
  });

  // Verifica a criação do token e a leitura dos dados do usuário autenticado.
  it('deve criar um token válido e recuperar seus dados', () => {
    service.setToken({ id: '1', name: 'Cliente', email: 'cliente@example.com' });

    expect(service.checkToken()).toBe(true);
    expect(service.getId()).toBe('1');
    expect(service.getName()).toBe('Cliente');
    expect(service.getEmail()).toBe('cliente@example.com');
  });

  // Garante que tokens ausentes, malformados ou modificados sejam recusados.
  it('deve rejeitar token ausente, incompleto ou adulterado', () => {
    expect(service.checkToken()).toBe(false);
    document.cookie = 'auth_token=invalid; path=/';
    expect(service.checkToken()).toBe(false);

    service.setToken({ id: '1', name: 'Cliente', email: 'cliente@example.com' });
    const token = document.cookie.split('auth_token=')[1].split(';')[0];
    document.cookie = `auth_token=${token.slice(0, -1)}x; path=/`;
    expect(service.checkToken()).toBe(false);
  });

  // Confirma o fallback para a sessão local quando o cookie não está disponível.
  it('deve usar a sessão quando o cookie não existe', () => {
    service.setToken({ id: '2', name: 'Sessão', email: 'sessao@example.com' });
    document.cookie = 'auth_token=; max-age=0; path=/';

    expect(service.checkToken()).toBe(true);
    expect(service.getId()).toBe('2');
    expect(service.getName()).toBe('Sessão');
  });

  // Verifica a limpeza completa da autenticação no logout.
  it('deve excluir cookie e sessão ao apagar o token', () => {
    service.setToken({ id: '3', name: 'Cliente', email: 'cliente@example.com' });
    service.deleteToken();

    expect(service.checkToken()).toBe(false);
    expect(service.getId()).toBe('');
    expect(service.getName()).toBe('');
    expect(service.getEmail()).toBe('');
  });
});