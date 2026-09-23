import { Order } from 'mercadopago';
import { randomUUID } from 'node:crypto';

export class PaymentService {
  constructor(mercadoPagoClient) {
    this.order = new Order(mercadoPagoClient);
  }

  async createTestOrder() {
    const totalAmount = '10.00';

    const body = {
      type: 'online',
      processing_mode: 'manual',
      total_amount: totalAmount,
      external_reference: `AGROAGREGA-TEST-${Date.now()}`,

      payer: {
        email: process.env.MERCADOPAGO_TEST_PAYER_EMAIL,
      },

      items: [
        {
          title: 'Pedido de teste AgroAgrega',
          quantity: 1,
          unit_price: totalAmount,
        },
      ],
    };

    const requestOptions = {
      idempotencyKey: randomUUID(),
    };

    const response = await this.order.create({
      body,
      requestOptions,
    });

    return {
      id: response.id,
      status: response.status,
      checkoutUrl: response.checkout_url,
    };
  }

  async getOrder(orderId) {
    const response = await this.order.get({
      id: orderId,
    });

    return {
      id: response.id,
      status: response.status,
      statusDetail: response.status_detail,
      totalAmount: response.total_amount,
      totalPaidAmount: response.total_paid_amount,
    };
  }

}
