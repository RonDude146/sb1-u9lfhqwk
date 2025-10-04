export interface ShiprocketConfig {
  email: string;
  password: string;
  channelId: string;
  environment: 'sandbox' | 'live';
}

export interface CreateShipmentParams {
  orderId: string;
  orderDate: string;
  pickupLocation: string;
  billingCustomerName: string;
  billingLastName: string;
  billingAddress: string;
  billingAddress2?: string;
  billingCity: string;
  billingPincode: string;
  billingState: string;
  billingCountry: string;
  billingEmail: string;
  billingPhone: string;
  shippingIsBilling: boolean;
  shippingCustomerName?: string;
  shippingLastName?: string;
  shippingAddress?: string;
  shippingAddress2?: string;
  shippingCity?: string;
  shippingPincode?: string;
  shippingCountry?: string;
  shippingState?: string;
  shippingEmail?: string;
  shippingPhone?: string;
  orderItems: Array<{
    name: string;
    sku: string;
    units: number;
    sellingPrice: number;
    discount?: number;
  }>;
  paymentMethod: 'Prepaid' | 'COD';
  subTotal: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

export interface ShiprocketResponse {
  orderId: number;
  shipmentId: number;
  status: string;
  statusCode: number;
  onboardingCompleted?: boolean;
  awb?: string;
  courierId?: number;
  courierName?: string;
}

export class ShiprocketService {
  private config: ShiprocketConfig;
  private baseUrl: string;
  private token?: string;
  private tokenExpiry?: Date;

  constructor() {
    this.config = {
      email: process.env.SHIPROCKET_EMAIL!,
      password: process.env.SHIPROCKET_PASSWORD!,
      channelId: process.env.SHIPROCKET_CHANNEL_ID!,
      environment: (process.env.SHIPROCKET_ENVIRONMENT as 'sandbox' | 'live') || 'sandbox',
    };

    this.baseUrl = this.config.environment === 'live' 
      ? 'https://apiv2.shiprocket.in/v1' 
      : 'https://apiv2.shiprocket.in/v1'; // Same URL for both for now
  }

  private async authenticate(): Promise<string> {
    if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.token;
    }

    const response = await fetch(`${this.baseUrl}/external/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.config.email,
        password: this.config.password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Shiprocket auth failed: ${data.message}`);
    }

    this.token = data.token;
    this.tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    return this.token;
  }

  async createShipment(params: CreateShipmentParams): Promise<ShiprocketResponse> {
    const token = await this.authenticate();

    const payload = {
      order_id: params.orderId,
      order_date: params.orderDate,
      pickup_location: params.pickupLocation,
      channel_id: this.config.channelId,
      comment: 'Newhill Spices Order',
      billing_customer_name: params.billingCustomerName,
      billing_last_name: params.billingLastName,
      billing_address: params.billingAddress,
      billing_address_2: params.billingAddress2 || '',
      billing_city: params.billingCity,
      billing_pincode: params.billingPincode,
      billing_state: params.billingState,
      billing_country: params.billingCountry,
      billing_email: params.billingEmail,
      billing_phone: params.billingPhone,
      shipping_is_billing: params.shippingIsBilling,
      shipping_customer_name: params.shippingCustomerName,
      shipping_last_name: params.shippingLastName,
      shipping_address: params.shippingAddress,
      shipping_address_2: params.shippingAddress2,
      shipping_city: params.shippingCity,
      shipping_pincode: params.shippingPincode,
      shipping_country: params.shippingCountry,
      shipping_state: params.shippingState,
      shipping_email: params.shippingEmail,
      shipping_phone: params.shippingPhone,
      order_items: params.orderItems,
      payment_method: params.paymentMethod,
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: params.subTotal,
      length: params.length,
      breadth: params.breadth,
      height: params.height,
      weight: params.weight,
    };

    const response = await fetch(`${this.baseUrl}/external/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Shiprocket shipment creation failed: ${JSON.stringify(data)}`);
    }

    return {
      orderId: data.order_id,
      shipmentId: data.shipment_id,
      status: data.status,
      statusCode: data.status_code,
      onboardingCompleted: data.onboarding_completed_now,
      awb: data.awb_code,
      courierId: data.courier_company_id,
      courierName: data.courier_name,
    };
  }

  async trackShipment(awb: string): Promise<any> {
    const token = await this.authenticate();

    const response = await fetch(`${this.baseUrl}/external/courier/track/awb/${awb}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  }

  async calculateShipping(params: {
    pickupPostcode: string;
    deliveryPostcode: string;
    weight: number;
    codAmount?: number;
  }) {
    const token = await this.authenticate();

    const response = await fetch(
      `${this.baseUrl}/external/courier/serviceability?pickup_postcode=${params.pickupPostcode}&delivery_postcode=${params.deliveryPostcode}&weight=${params.weight}&cod=${params.codAmount || 0}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return response.json();
  }
}