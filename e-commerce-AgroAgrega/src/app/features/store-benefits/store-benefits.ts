import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { COUPONS } from '@core/data/coupons';
import { Auth } from '@core/services/auth/auth.service';
import { Cart } from '@core/services/cart/cart.service';
import { CouponModel } from '@models/coupon';

type StoreBenefitMode = 'coupons' | 'agroPlus';

@Component({
  selector: 'app-store-benefits',
  imports: [RouterLink],
  templateUrl: './store-benefits.html',
  styleUrl: './store-benefits.css',
})
export class StoreBenefitsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cart = inject(Cart);
  readonly auth = inject(Auth);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mode = (this.route.snapshot.data['storeBenefitMode'] ?? 'coupons') as StoreBenefitMode;
  readonly coupons = COUPONS;
  readonly agroPlusCoupon = COUPONS.find((coupon) => coupon.code === 'AGRO20')!;
  readonly agroPlusActive = signal(false);
  readonly feedbackMessage = signal('');

  constructor() {
    this.agroPlusActive.set(this.readAgroPlusMembership());
  }

  isCouponApplied(coupon: CouponModel): boolean {
    return this.cart.coupon()?.code === coupon.code;
  }

  isAgroPlusCoupon(coupon: CouponModel): boolean {
    return coupon.code === 'AGRO20';
  }

  couponTitle(coupon: CouponModel): string {
    const titles: Record<string, string> = {
      AGRO20: 'Benefício Agro+',
      BEMVINDO10: 'Primeira compra',
      CAMPO15: 'Especial do campo',
      SAFRA12: 'Temporada da safra',
      EQUIPA10: 'Renove seus equipamentos',
      AGUA8: 'Economia na irrigação',
    };

    return titles[coupon.code] ?? 'Oferta AgroAgrega';
  }

  couponDescription(coupon: CouponModel): string {
    const descriptions: Record<string, string> = {
      AGRO20: 'Desconto exclusivo para membros Agro+ em produtos participantes.',
      BEMVINDO10: 'Uma ajuda para começar sua primeira compra no catálogo AgroAgrega.',
      CAMPO15: 'Mais economia para equipar a propriedade e cuidar da produção.',
      SAFRA12: 'Aproveite a temporada para preparar sua próxima compra.',
      EQUIPA10: 'Um incentivo para renovar ferramentas, máquinas e acessórios.',
      AGUA8: 'Economize em soluções que ajudam a cuidar de cada gota no campo.',
    };

    return descriptions[coupon.code] ?? 'Desconto disponível por tempo limitado.';
  }

  applyCoupon(coupon: CouponModel): void {
    if (this.isAgroPlusCoupon(coupon) && !this.agroPlusActive()) {
      this.router.navigate(['/agro-plus']);
      return;
    }

    this.cart.applyCoupon(coupon.code);
    this.feedbackMessage.set(`Cupom ${coupon.code} aplicado. O desconto aparecerá no carrinho.`);
  }

  activateAgroPlus(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const userId = this.auth.currentUserId() || this.auth.getId();

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.membershipKey(userId), 'active');
    }

    this.agroPlusActive.set(true);
    this.feedbackMessage.set('Agro+ ativado. Seu cupom exclusivo já está disponível.');
  }

  applyAgroPlusCoupon(): void {
    this.applyCoupon(this.agroPlusCoupon);
  }

  private readAgroPlusMembership(): boolean {
    if (!isPlatformBrowser(this.platformId) || !this.auth.isLoggedIn()) {
      return false;
    }

    const userId = this.auth.currentUserId() || this.auth.getId();
    return Boolean(userId && localStorage.getItem(this.membershipKey(userId)) === 'active');
  }

  private membershipKey(userId: string): string {
    return `agro-plus-membership-${userId}`;
  }
}
