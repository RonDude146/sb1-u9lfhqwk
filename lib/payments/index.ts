import { RazorpayProvider } from './razorpay';
import { DibsyProvider, TelrProvider, MoyasarProvider, OmanNetProvider } from './mock-providers';
import { PaymentProvider } from './types';

const providers = new Map<string, PaymentProvider>([
  ['razorpay', new RazorpayProvider()],
  ['dibsy', new DibsyProvider()],
  ['telr', new TelrProvider()],
  ['moyasar', new MoyasarProvider()],
  ['omannet', new OmanNetProvider()],
]);

export function getPaymentProvider(country: string): PaymentProvider {
  switch (country.toUpperCase()) {
    case 'IN':
      return providers.get('razorpay')!;
    case 'QA':
      return providers.get('dibsy')!;
    case 'AE':
      return providers.get('telr')!;
    case 'SA':
      return providers.get('moyasar')!;
    case 'OM':
      return providers.get('omannet')!;
    default:
      // Default to Razorpay for unsupported regions
      return providers.get('razorpay')!;
  }
}

export function getProviderByName(name: string): PaymentProvider | undefined {
  return providers.get(name);
}

export * from './types';