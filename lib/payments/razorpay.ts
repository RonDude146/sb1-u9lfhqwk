import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PaymentProvider, CreateOrderParams, CreateOrderResponse, VerifyPaymentParams, RefundParams, RefundResponse } from './types';

export class RazorpayProvider implements PaymentProvider {
  name = 'razorpay';
  region = ['IN'];
  private client: Razorpay;

  constructor() {
    this.client = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createOrder(params: CreateOrderParams): Promise<CreateOrderResponse> {
    const order = await this.client.orders.create({
      amount: Math.round(params.amount * 100), // Convert to paise
      currency: params.currency,
      receipt: params.orderId,
      notes: {
        customer_email: params.customerEmail,
        customer_phone: params.customerPhone || '',
      },
    });

    return {
      providerOrderId: order.id,
      metadata: {
        keyId: process.env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
      },
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
    const { providerPaymentId, providerOrderId, signature } = params;
    
    if (!signature) return false;

    const body = providerOrderId + '|' + providerPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    return signature === expectedSignature;
  }

  async refund(params: RefundParams): Promise<RefundResponse> {
    const refund = await this.client.payments.refund(params.providerPaymentId, {
      amount: Math.round(params.amount * 100),
      notes: {
        reason: params.reason || 'Customer requested refund',
      },
    });

    return {
      refundId: refund.id,
      status: refund.status === 'processed' ? 'completed' : 'processing',
      amount: refund.amount / 100,
    };
  }
}