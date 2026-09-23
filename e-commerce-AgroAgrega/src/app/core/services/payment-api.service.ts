import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentResponse {
  id: string;
  status: string;
  checkoutUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentApiService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/payments';

  criarPedidoTeste(): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(this.apiUrl, {});
  }
}