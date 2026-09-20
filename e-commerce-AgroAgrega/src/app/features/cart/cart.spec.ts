import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart';
import { provideRouter, RouterLink } from '@angular/router';
import { PrecoFormatadoPipe } from '../../shared/pipes/preco-formatado-pipe';
import { ProductModel } from '../../models/product';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent, RouterLink, PrecoFormatadoPipe],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve encaminhar ações do carrinho para o serviço', () => {
    const product: ProductModel = {
      id: 'product-1',
      title: 'Produto',
      price: 10,
      description: 'Descrição',
      category: 'Ferramentas',
      weeklySales: 1,
      rating: 4,
      images: [],
    };
    const input = document.createElement('input');
    input.value = '2';

    component.addProduct(product);
    component.applyCoupon('BEMVINDO10');
    component.decreaseProductQuantity(product);
    component.removeProduct(product);
    component.cleanInputValue(input);
    component.clearCart();
    component.removeCoupon();

    expect(input.value).toBe('');
    expect(component.cartItems()).toEqual([]);
  });
});
