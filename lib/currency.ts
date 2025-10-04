import { db } from './db';

export const SUPPORTED_CURRENCIES = {
  INR: { symbol: '₹', name: 'Indian Rupee' },
  QAR: { symbol: 'ر.ق', name: 'Qatari Riyal' },
  AED: { symbol: 'د.إ', name: 'UAE Dirham' },
  SAR: { symbol: 'ر.س', name: 'Saudi Riyal' },
  OMR: { symbol: 'ر.ع.', name: 'Omani Rial' },
};

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

export async function convertPrice(
  priceINR: number,
  targetCurrency: CurrencyCode
): Promise<number> {
  if (targetCurrency === 'INR') {
    return priceINR;
  }

  const rate = await db.currencyRate.findUnique({
    where: { currencyCode: targetCurrency },
  });

  if (!rate) {
    throw new Error(`Currency rate not found for ${targetCurrency}`);
  }

  return Math.round((priceINR / Number(rate.rateToINR)) * 100) / 100;
}

export function formatPrice(price: number, currency: CurrencyCode): string {
  const { symbol } = SUPPORTED_CURRENCIES[currency];
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'OMR' ? 3 : 2,
  }).format(price).replace(/[A-Z]{3}/, symbol);
}

export async function updateCurrencyRates(): Promise<void> {
  // Mock exchange rates - in production, fetch from a real API
  const rates = {
    QAR: 20.25, // 1 QAR = 20.25 INR
    AED: 22.50, // 1 AED = 22.50 INR  
    SAR: 22.00, // 1 SAR = 22.00 INR
    OMR: 215.00, // 1 OMR = 215.00 INR
  };

  for (const [currencyCode, rateToINR] of Object.entries(rates)) {
    await db.currencyRate.upsert({
      where: { currencyCode },
      update: { rateToINR },
      create: { currencyCode, rateToINR },
    });
  }
}