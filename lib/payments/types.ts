export interface PaymentProvider {
  name: string;
  region: string[];
  createOrder(params: CreateOrderParams): Promise<CreateOrderResponse>;
  verifyPayment(params: VerifyPaymentParams): Promise<boolean>;
  refund(params: RefundParams): Promise<RefundResponse>;
}

export interface CreateOrderParams {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerPhone?: string;
  returnUrl?: string;
  webhookUrl?: string;
}

export interface CreateOrderResponse {
  providerOrderId: string;
  clientSecret?: string;
  redirectUrl?: string;
  metadata?: Record<string, any>;
}

export interface VerifyPaymentParams {
  providerPaymentId: string;
  providerOrderId: string;
  signature?: string;
  metadata?: Record<string, any>;
}

export interface RefundParams {
  providerPaymentId: string;
  amount: number;
  reason?: string;
}

export interface RefundResponse {
  refundId: string;
  status: 'processing' | 'completed' | 'failed';
  amount: number;
}