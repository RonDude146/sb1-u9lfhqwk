import { PaymentProvider, CreateOrderParams, CreateOrderResponse, VerifyPaymentParams, RefundParams, RefundResponse } from './types';

// Mock provider for Qatar - Dibsy
export class DibsyProvider implements PaymentProvider {
  name = 'dibsy';
  region = ['QA'];

  async createOrder(params: CreateOrderParams): Promise<CreateOrderResponse> {
    // Mock implementation
    const mockOrderId = `dibsy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      providerOrderId: mockOrderId,
      redirectUrl: `https://sandbox.dibsy.com/checkout/${mockOrderId}`,
      metadata: {
        amount: params.amount,
        currency: params.currency,
      },
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
    // Mock verification - in production, verify with Dibsy API
    return params.providerPaymentId.startsWith('dibsy_pay_');
  }

  async refund(params: RefundParams): Promise<RefundResponse> {
    return {
      refundId: `dibsy_rfnd_${Date.now()}`,
      status: 'processing',
      amount: params.amount,
    };
  }
}

// Mock provider for UAE - Telr
export class TelrProvider implements PaymentProvider {
  name = 'telr';
  region = ['AE'];

  async createOrder(params: CreateOrderParams): Promise<CreateOrderResponse> {
    const mockOrderId = `telr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      providerOrderId: mockOrderId,
      redirectUrl: `https://secure.telr.com/gateway/${mockOrderId}`,
      metadata: {
        storeId: process.env.TELR_STORE_ID,
        amount: params.amount,
        currency: params.currency,
      },
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
    return params.providerPaymentId.startsWith('telr_pay_');
  }

  async refund(params: RefundParams): Promise<RefundResponse> {
    return {
      refundId: `telr_rfnd_${Date.now()}`,
      status: 'processing',
      amount: params.amount,
    };
  }
}

// Mock provider for Saudi - Moyasar
export class MoyasarProvider implements PaymentProvider {
  name = 'moyasar';
  region = ['SA'];

  async createOrder(params: CreateOrderParams): Promise<CreateOrderResponse> {
    const mockOrderId = `moya_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      providerOrderId: mockOrderId,
      clientSecret: `moya_cs_${mockOrderId}`,
      metadata: {
        publishableKey: process.env.MOYASAR_PUBLIC_KEY,
        amount: params.amount * 100, // Convert to halalas
        currency: params.currency,
      },
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
    return params.providerPaymentId.startsWith('moya_pay_');
  }

  async refund(params: RefundParams): Promise<RefundResponse> {
    return {
      refundId: `moya_rfnd_${Date.now()}`,
      status: 'processing',
      amount: params.amount,
    };
  }
}

// Mock provider for Oman - OmanNet
export class OmanNetProvider implements PaymentProvider {
  name = 'omannet';
  region = ['OM'];

  async createOrder(params: CreateOrderParams): Promise<CreateOrderResponse> {
    const mockOrderId = `oman_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      providerOrderId: mockOrderId,
      redirectUrl: `https://payments.omannet.om/gateway/${mockOrderId}`,
      metadata: {
        merchantId: process.env.OMANNET_MERCHANT_ID,
        amount: params.amount,
        currency: params.currency,
      },
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
    return params.providerPaymentId.startsWith('oman_pay_');
  }

  async refund(params: RefundParams): Promise<RefundResponse> {
    return {
      refundId: `oman_rfnd_${Date.now()}`,
      status: 'processing',
      amount: params.amount,
    };
  }
}