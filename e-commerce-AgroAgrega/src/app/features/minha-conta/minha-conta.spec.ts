import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MinhaConta } from './minha-conta';

describe('MinhaConta', () => {
  let component: MinhaConta;
  let fixture: ComponentFixture<MinhaConta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhaConta],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MinhaConta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the available avatars when the picker opens', async () => {
    const openButton = fixture.nativeElement.querySelector(
      '[aria-controls="avatar-picker"]',
    ) as HTMLButtonElement;
    openButton.click();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('.avatar-options button')).toHaveLength(50);
    expect(host.textContent).toContain('Cavalo');
    expect(host.textContent).toContain('Ovelha');
    expect(host.textContent).toContain('Galinha');
    expect(host.textContent).toContain('Porquinho');
    expect(host.textContent).toContain('Cão do campo');
    expect(host.textContent).toContain('Abelha');
  });
});
