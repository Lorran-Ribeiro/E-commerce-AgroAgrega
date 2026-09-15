import { isPlatformBrowser } from '@angular/common';
import { computed, DestroyRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { productsItems } from '../../data/products';
import { ProductCategory, ProductModel, ReviewModel } from '../../../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly baseProducts = signal<ProductModel[]>(productsItems);
  private readonly catalogDate = signal(new Date());
  private refreshTimer?: ReturnType<typeof setTimeout>;
  private readonly products = computed(() =>
    applyDailyFlashOffers(this.baseProducts(), this.catalogDate()),
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.scheduleNextDailyRefresh();
      this.destroyRef.onDestroy(() => clearTimeout(this.refreshTimer));
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(id: string): ProductModel | undefined {
    return this.products().find((product) => product.id === id);
  }

  getProductCategories(): ProductCategory[] {
    return ['Agricultura de Precisão', 'Irrigação', 'Pecuária', 'Insumos', 'Ferramentas'];
  }

  addReview(productId: string, review: Omit<ReviewModel, 'id'> & { id?: string }): void {
    this.baseProducts.update((currentProducts) =>
      currentProducts.map((product) => {
        if (product.id !== productId) {
          return product;
        }

        const existingReviews = product.reviews ?? [];
        const newReview: ReviewModel = {
          id: review.id ?? `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          author: review.author ?? 'Cliente AgroAgrega',
          stars: review.stars,
          text: review.text,
          createdAt: review.createdAt ?? new Date().toLocaleDateString('pt-BR'),
        };

        const updatedReviews = [newReview, ...existingReviews];
        const totalStars = updatedReviews.reduce((sum, item) => sum + item.stars, 0);
        const averageRating = Number((totalStars / updatedReviews.length).toFixed(1));

        return {
          ...product,
          rating: averageRating,
          reviews: updatedReviews,
        };
      }),
    );
  }

  private scheduleNextDailyRefresh(): void {
    const now = new Date();
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const delay = Math.max(1000, nextDay.getTime() - now.getTime() + 1000);

    this.refreshTimer = setTimeout(() => {
      this.catalogDate.set(new Date());
      this.scheduleNextDailyRefresh();
    }, delay);
  }
}

export function applyDailyFlashOffers(
  products: ProductModel[],
  date: Date,
  offerCount = 6,
): ProductModel[] {
  const normalizedProducts = products.map((product) => ({
    ...product,
    flashOffer: false,
    flashOfferDiscount: undefined,
    flashOfferDate: undefined,
  }));
  const eligibleProducts = normalizedProducts
    .filter((product) => product.originalPrice === undefined)
    .sort((first, second) => stableProductHash(first.id) - stableProductHash(second.id));

  if (eligibleProducts.length === 0 || offerCount <= 0) {
    return normalizedProducts;
  }

  const safeOfferCount = Math.min(Math.trunc(offerCount), eligibleProducts.length);
  const dayNumber = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  const startIndex = (dayNumber * safeOfferCount) % eligibleProducts.length;
  const discountOptions = [12, 15, 18, 20, 22, 25, 28, 30];
  const dailyOffers = new Map<string, ProductModel>();
  const dateKey = formatDateKey(date);

  for (let index = 0; index < safeOfferCount; index += 1) {
    const product = eligibleProducts[(startIndex + index) % eligibleProducts.length];
    const discount = discountOptions[(dayNumber + index) % discountOptions.length];

    dailyOffers.set(product.id, {
      ...product,
      originalPrice: product.price,
      price: Number((product.price * (1 - discount / 100)).toFixed(2)),
      flashOffer: true,
      flashOfferDiscount: discount,
      flashOfferDate: dateKey,
    });
  }

  return normalizedProducts.map((product) => dailyOffers.get(product.id) ?? product);
}

function stableProductHash(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }

  return Math.abs(hash);
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
