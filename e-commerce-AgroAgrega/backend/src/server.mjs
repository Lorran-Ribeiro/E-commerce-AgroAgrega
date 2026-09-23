import express from 'express';
import { createPaymentRouter } from './routes/payment.routes.mjs';
import { PaymentService } from './services/payment.service.mjs';
import { MercadoPagoConfig } from 'mercadopago';

const app = express();

const PORT = process.env.PORT || 3000;

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error(
    'MERCADOPAGO_ACCESS_TOKEN não foi configurado no arquivo .env'
  );
}

const mercadoPago = new MercadoPagoConfig({
  accessToken,
  options: {
    timeout: 5000,
  },
});

const paymentService = new PaymentService(mercadoPago);

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use('/api/payments', createPaymentRouter(paymentService));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API AgroAgrega funcionando',
  });
});

app.listen(PORT, () => {
  console.log(`API AgroAgrega rodando em http://localhost:${PORT}`);
  console.log('Mercado Pago configurado com credencial de teste.');
});