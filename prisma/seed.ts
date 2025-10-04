import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Full system access',
      permissions: {
        products: ['create', 'read', 'update', 'delete'],
        orders: ['create', 'read', 'update', 'delete'],
        users: ['create', 'read', 'update', 'delete'],
        b2b: ['create', 'read', 'update', 'delete'],
        settings: ['create', 'read', 'update', 'delete'],
      },
    },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: 'customer' },
    update: {},
    create: {
      name: 'customer',
      description: 'Customer access',
      permissions: {
        products: ['read'],
        orders: ['create', 'read'],
        profile: ['read', 'update'],
      },
    },
  });

  // Create super admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@newhillspices.com' },
    update: {},
    create: {
      email: 'admin@newhillspices.com',
      name: 'Super Admin',
      emailVerified: new Date(),
    },
  });

  // Assign admin role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  // Create currency rates
  const currencyRates = [
    { currencyCode: 'QAR', rateToINR: 20.25 },
    { currencyCode: 'AED', rateToINR: 22.50 },
    { currencyCode: 'SAR', rateToINR: 22.00 },
    { currencyCode: 'OMR', rateToINR: 215.00 },
  ];

  for (const rate of currencyRates) {
    await prisma.currencyRate.upsert({
      where: { currencyCode: rate.currencyCode },
      update: { rateToINR: rate.rateToINR },
      create: rate,
    });
  }

  // Create lots for spices
  const lots = [
    {
      batchCode: 'LOT-CARD-001',
      originEstate: 'Munnar Hills Estate',
      harvestedOn: new Date('2024-10-15'),
      bestBefore: new Date('2025-10-15'),
      qcNotes: 'Premium grade cardamom, excellent aroma',
      totalQty: 1000,
      availableQty: 1000,
    },
    {
      batchCode: 'LOT-PEPPER-001',
      originEstate: 'Wayanad Spice Garden',
      harvestedOn: new Date('2024-09-20'),
      bestBefore: new Date('2026-09-20'),
      qcNotes: 'High piperine content, bold flavor',
      totalQty: 500,
      availableQty: 500,
    },
    {
      batchCode: 'LOT-CINN-001',
      originEstate: 'Kerala Spice Co-op',
      harvestedOn: new Date('2024-11-01'),
      bestBefore: new Date('2027-11-01'),
      qcNotes: 'True Ceylon cinnamon, sweet and mild',
      totalQty: 300,
      availableQty: 300,
    },
  ];

  for (const lot of lots) {
    await prisma.lot.upsert({
      where: { batchCode: lot.batchCode },
      update: lot,
      create: lot,
    });
  }

  // Create products with variants
  const spiceProducts = [
    {
      name: 'Premium Green Cardamom',
      slug: 'premium-green-cardamom',
      description: 'Finest quality green cardamom pods from the hills of Munnar. Hand-picked for maximum aroma and flavor.',
      shortDesc: 'Premium quality green cardamom pods',
      origin: 'Munnar Hills, Kerala',
      category: 'spices',
      tags: ['cardamom', 'premium', 'organic', 'kerala'],
      hsnCode: '09083100',
      gstRate: 5.00,
      images: [
        'https://images.pexels.com/photos/4198943/pexels-photo-4198943.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      isFeatured: true,
      variants: [
        { sku: 'CARD-50G', name: '50g Pouch', weightGrams: 50, priceINR: 450, mrpINR: 500, stockQty: 100 },
        { sku: 'CARD-100G', name: '100g Pouch', weightGrams: 100, priceINR: 850, mrpINR: 950, stockQty: 75 },
        { sku: 'CARD-250G', name: '250g Jar', weightGrams: 250, priceINR: 2000, mrpINR: 2200, packaging: 'jar', stockQty: 50 },
        { sku: 'CARD-500G', name: '500g Box', weightGrams: 500, priceINR: 3800, mrpINR: 4200, packaging: 'box', stockQty: 25 },
      ],
    },
    {
      name: 'Black Pepper Whole',
      slug: 'black-pepper-whole',
      description: 'Premium black pepper corns with high piperine content. Perfect for grinding fresh or using whole in cooking.',
      shortDesc: 'Whole black pepper corns',
      origin: 'Wayanad, Kerala',
      category: 'spices',
      tags: ['black-pepper', 'piperine', 'whole', 'kerala'],
      hsnCode: '09041100',
      gstRate: 5.00,
      images: [
        'https://images.pexels.com/photos/4198935/pexels-photo-4198935.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      isFeatured: true,
      variants: [
        { sku: 'PEPPER-100G', name: '100g Pouch', weightGrams: 100, priceINR: 180, mrpINR: 200, stockQty: 150 },
        { sku: 'PEPPER-250G', name: '250g Jar', weightGrams: 250, priceINR: 420, mrpINR: 470, packaging: 'jar', stockQty: 100 },
        { sku: 'PEPPER-500G', name: '500g Box', weightGrams: 500, priceINR: 800, mrpINR: 900, packaging: 'box', stockQty: 60 },
        { sku: 'PEPPER-1KG', name: '1kg Box', weightGrams: 1000, priceINR: 1500, mrpINR: 1700, packaging: 'box', stockQty: 30 },
      ],
    },
    {
      name: 'Ceylon Cinnamon Sticks',
      slug: 'ceylon-cinnamon-sticks',
      description: 'Authentic Ceylon cinnamon sticks with sweet, delicate flavor. Perfect for desserts and tea.',
      shortDesc: 'True Ceylon cinnamon sticks',
      origin: 'Kerala Spice Gardens',
      category: 'spices',
      tags: ['cinnamon', 'ceylon', 'sticks', 'sweet'],
      hsnCode: '09061100',
      gstRate: 5.00,
      images: [
        'https://images.pexels.com/photos/4198925/pexels-photo-4198925.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      isFeatured: true,
      variants: [
        { sku: 'CINN-50G', name: '50g Pouch', weightGrams: 50, priceINR: 120, mrpINR: 140, stockQty: 120 },
        { sku: 'CINN-100G', name: '100g Jar', weightGrams: 100, priceINR: 220, mrpINR: 250, packaging: 'jar', stockQty: 80 },
        { sku: 'CINN-250G', name: '250g Box', weightGrams: 250, priceINR: 520, mrpINR: 580, packaging: 'box', stockQty: 40 },
      ],
    },
    {
      name: 'Organic Turmeric Powder',
      slug: 'organic-turmeric-powder',
      description: 'Certified organic turmeric powder with high curcumin content. Freshly ground from Kerala turmeric.',
      shortDesc: 'Organic turmeric powder',
      origin: 'Certified Organic Farms',
      category: 'spices',
      tags: ['turmeric', 'organic', 'curcumin', 'powder'],
      hsnCode: '09103000',
      gstRate: 5.00,
      images: [
        'https://images.pexels.com/photos/4198937/pexels-photo-4198937.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      isFeatured: true,
      variants: [
        { sku: 'TURM-100G', name: '100g Pouch', weightGrams: 100, priceINR: 90, mrpINR: 110, stockQty: 200 },
        { sku: 'TURM-250G', name: '250g Jar', weightGrams: 250, priceINR: 200, mrpINR: 240, packaging: 'jar', stockQty: 150 },
        { sku: 'TURM-500G', name: '500g Box', weightGrams: 500, priceINR: 380, mrpINR: 450, packaging: 'box', stockQty: 80 },
        { sku: 'TURM-1KG', name: '1kg Box', weightGrams: 1000, priceINR: 720, mrpINR: 850, packaging: 'box', stockQty: 50 },
      ],
    },
    {
      name: 'Whole Cloves',
      slug: 'whole-cloves',
      description: 'Premium quality whole cloves with intense aroma and flavor. Perfect for both sweet and savory dishes.',
      shortDesc: 'Premium whole cloves',
      origin: 'Kerala Hill Stations',
      category: 'spices',
      tags: ['cloves', 'whole', 'aromatic', 'kerala'],
      hsnCode: '09070000',
      gstRate: 5.00,
      images: [
        'https://images.pexels.com/photos/5946080/pexels-photo-5946080.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      variants: [
        { sku: 'CLOVE-50G', name: '50g Pouch', weightGrams: 50, priceINR: 280, mrpINR: 320, stockQty: 80 },
        { sku: 'CLOVE-100G', name: '100g Jar', weightGrams: 100, priceINR: 520, mrpINR: 580, packaging: 'jar', stockQty: 60 },
        { sku: 'CLOVE-250G', name: '250g Box', weightGrams: 250, priceINR: 1200, mrpINR: 1350, packaging: 'box', stockQty: 30 },
      ],
    },
    {
      name: 'Whole Nutmeg',
      slug: 'whole-nutmeg',
      description: 'Fresh whole nutmeg with rich, warm flavor. Grate fresh for maximum potency in your cooking.',
      shortDesc: 'Premium whole nutmeg',
      origin: 'Kerala Spice Plantations',
      category: 'spices',
      tags: ['nutmeg', 'whole', 'fresh', 'warm-spice'],
      hsnCode: '09080100',
      gstRate: 5.00,
      images: [
        'https://images.pexels.com/photos/4198949/pexels-photo-4198949.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      variants: [
        { sku: 'NUTMEG-25G', name: '25g Pouch', weightGrams: 25, priceINR: 180, mrpINR: 210, stockQty: 50 },
        { sku: 'NUTMEG-50G', name: '50g Jar', weightGrams: 50, priceINR: 340, mrpINR: 380, packaging: 'jar', stockQty: 40 },
        { sku: 'NUTMEG-100G', name: '100g Box', weightGrams: 100, priceINR: 650, mrpINR: 720, packaging: 'box', stockQty: 25 },
      ],
    },
  ];

  for (const productData of spiceProducts) {
    const { variants, ...product } = productData;
    
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });

    for (const variant of variants) {
      await prisma.productVariant.upsert({
        where: { sku: variant.sku },
        update: { ...variant, productId: createdProduct.id },
        create: { ...variant, productId: createdProduct.id },
      });
    }
  }

  // Create sample business account
  const businessUser = await prisma.user.upsert({
    where: { email: 'business@example.com' },
    update: {},
    create: {
      email: 'business@example.com',
      name: 'Spice Traders LLC',
      emailVerified: new Date(),
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: businessUser.id,
        roleId: customerRole.id,
      },
    },
    update: {},
    create: {
      userId: businessUser.id,
      roleId: customerRole.id,
    },
  });

  await prisma.businessAccount.upsert({
    where: { userId: businessUser.id },
    update: {},
    create: {
      userId: businessUser.id,
      companyName: 'Spice Traders LLC',
      gstin: '29ABCDE1234F1Z5',
      businessType: 'retailer',
      isApproved: true,
      approvedAt: new Date(),
      creditLimit: 100000,
    },
  });

  // Create sample discount codes
  const discountCodes = [
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minOrderINR: 500,
      maxDiscountINR: 200,
      usageLimit: 1000,
      userLimit: 1,
      validFrom: new Date(),
      validUntil: new Date('2025-12-31'),
    },
    {
      code: 'BULK500',
      type: 'fixed',
      value: 500,
      minOrderINR: 5000,
      usageLimit: 100,
      userLimit: 3,
      validFrom: new Date(),
      validUntil: new Date('2025-12-31'),
    },
  ];

  for (const code of discountCodes) {
    await prisma.discountCode.upsert({
      where: { code: code.code },
      update: code,
      create: code,
    });
  }

  // Create system settings for toggles
  const systemSettings = [
    { key: 'multiLang', value: { enabled: true } },
    { key: 'multiCurrency', value: { enabled: true } },
    { key: 'enableB2B', value: { enabled: true } },
    { key: 'allowGuestCheckout', value: { enabled: false } },
    { key: 'enableNewsletter', value: { enabled: true } },
    { key: 'enableSubscriptions', value: { enabled: false } },
    { key: 'enableGCCShipping', value: { enabled: true } },
  ];

  for (const setting of systemSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  // Create sample translation keys
  const translationKeys = [
    {
      key: 'nav.products',
      en: 'Products',
      hi: 'उत्पादों',
      ta: 'பொருட்கள்',
      kn: 'ಉತ್ಪನ್ನಗಳು',
      ar: 'منتجات',
    },
    {
      key: 'nav.about',
      en: 'About',
      hi: 'के बारे में',
      ta: 'பற்றி',
      kn: 'ಬಗ್ಗೆ',
      ar: 'حول',
    },
    {
      key: 'nav.contact',
      en: 'Contact',
      hi: 'संपर्क करें',
      ta: 'தொடர்பு',
      kn: 'ಸಂಪರ್ಕಿಸಿ',
      ar: 'اتصل',
    },
    {
      key: 'product.addToCart',
      en: 'Add to Cart',
      hi: 'कार्ट में जोड़ें',
      ta: 'வண்டியில் சேர்',
      kn: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ',
      ar: 'أضف إلى السلة',
    },
  ];

  for (const translation of translationKeys) {
    await prisma.translationKey.upsert({
      where: { key: translation.key },
      update: translation,
      create: translation,
    });
  }

  console.log('🌱 Seed completed successfully!');
  console.log('👤 Admin user: admin@newhillspices.com');
  console.log('👤 Business user: business@example.com');
  console.log('🎟️  Discount codes: WELCOME10, BULK500');
  console.log('📦 Created 6 spice products with variants');
  console.log('💰 Currency rates set for QAR, AED, SAR, OMR');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });