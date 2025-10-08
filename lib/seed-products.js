// scripts/seed-products.js
const admin = require('firebase-admin');
const FIREBASE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDIo2L1/agkT3iU\n8wXgBNCTWwwDWYVgSXMFFMzFNPs/y1zPvTpI7cV4q3og2fmHmeBh2+OK53TnRLze\nRsjP8J8e139YPEf2/lpG8FID8d1zzxwIavTOlGkaSbyBo9uhnGEd2oq4DN6wRbgF\nRPbXp+OLNU/Yds0Md/8l0AGq7a70F0z7q2akGgQCderWjKqjnfrngd0Kw3hVy9xZ\n4VJ8+H9/PAOdys/5JB71PRXK1qKN75aZlx+FXKuuoJc3fXVQhwGFYnR4HmitZ2hG\nVesXsY72T4XYoeos7/ie6oOQTYhojh1rR+o4SBlRUQiWJttjUC8l4wCVPVwKx73T\nDG7poqvNAgMBAAECggEAVPv77WU5hNPSqAi+StLPRDNTBdIz8AJ8gUD7sWaNK8ro\nb6ff2cc5FzFPBD4/9yODCwBYQ9xhRJp1g5Mo+QcbZzVxX7783o6DT7v4iWo32pd1\n8MzZD+2GDVgBTEpLPAugiUQp8OamprSJS1YYVmVrOOpmfTJpDSiAvxP5uNx/eCzs\nEhZbbHMUidNIpPXOnd+ReXASxW9NexzryZYS5bOkYO8RbWjKL6k4tHVkhjwDOsRp\nU++vrkZZaXRudJQDQeWaMoIgG0hFvavltxAjq23tXka7WA/xOqkLwBdTu4b2wweV\nae0kxm7uCCUvAoVQeRmBWjOid0CR2tg8K0yNaXzWUwKBgQDxdF3beo8Do5UOvjbZ\n4yiBVi7BTa4ez1NA1pxLzhdgxeCE3Er7iog7tzltFqzBUKR+REia/5O7S+9YGHMQ\nxfUTui030VzCA1JajFuHEIQarcPWaCUv7Q1SRfZYrIYuprQKvDDdIpeFfA1ct77x\nxwsZAwXleVQYdtzpgUoqzK5s7wKBgQDUuZBX8wWmhCoxpC3Z1EoLgcCzlHNFy6IH\ngMylX7nbN8Kaj4ODXa2WB2CTe4yJsRbEpiNUY2xX1fvGibsim+PvbNEuWB3LCWel\nwwkWrDXOgp23y+cm8cuCAbP8+XQQPlsV67mAJwHE1XXrxW33hdB4IMLc6pwUMhMv\nXSodI+jrAwKBgQCgPD1dPgRSwehVlF4KUvm6e1sj5U08HRJ+4O1wUSCqlCbfhOIt\n9E1cc8ekYXvb/oxrTx1v31RG46m+qNsTsotlwBPqCwKnrlSkyqijBY7ltZNVYl/r\nYkGI6+0EA9o4c2DgDuvOlPpBF4Y2laoeAZ2Xx63OD6qDYb5RJ//0T0kh+QKBgF15\nhQIAmhUHsnrJyBQWAst3orPGobijuHlPkZ2BqOu5XtwIACQzf9mTOE7WVXUTygtz\nbcbhQXR/ZPljAEY+9jP5Pxn8Qms7oL3oLBA4cBRktOVUxigIzAI+uVaKTwPsQp4p\nTQQRH+fcXMrToHTJ6kc/LiFhPmBpeKCxcZYId4r9AoGAf6JCn+U025q7T011xerz\nzoCC22CPLM4DPvKb973C7B+VrXUs+wjnPjKUjsF0LA8HYWFZTcYSCrzZ38Nni1mX\n1kHdLMQ5l1wfh6pP97raxPx3GXv4UIRyywoDp1bbvjUSqJblqPH6d9xk3vrXs9Kf\nftJyLTouTrWL5qyzZlNlihU=\n-----END PRIVATE KEY-----\n'

// Environment variables
const projectId = 'hardy-audio-447701-j4';
const clientEmail = 'firebase-adminsdk-fbsvc@hardy-audio-447701-j4.iam.gserviceaccount.com';
const privateKey = FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const storageBucket = 'hardy-audio-447701-j4.firebasestorage.app';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = admin.firestore();

const products = [
  // HOODIES
  {
    name: 'Classic Black Hoodie',
    slug: 'classic-black-hoodie',
    description: 'Premium heavyweight cotton hoodie with embroidered logo. Perfect for everyday wear with a relaxed fit and soft brushed interior. Features adjustable drawstring hood, kangaroo pocket, and ribbed cuffs.',
    shortDescription: 'Premium heavyweight cotton hoodie with embroidered logo',
    price: 75.00,
    compareAtPrice: 95.00,
    discountPercent: 21,
    category: 'Clothings',
    subCategory: 'Hood Wears',
    itemType: 'Hoodies',
    categoryPath: '/clothings/hood-wears/hoodies',
    images: [
      {
        id: 'img-1',
        publicId: 'hoodskool/hoodies/black-hoodie-1',
        url: '/banner/HoodSkool_банер правка.jpg',
        secureUrl: '/banner/HoodSkool_банер правка.jpg',
        altText: 'Classic Black Hoodie Front View',
        order: 0,
        isPrimary: true,
      },
      {
        id: 'img-2',
        publicId: 'hoodskool/hoodies/black-hoodie-2',
        url: '/banner/HoodSkool_банер 1 _resized.jpg',
        secureUrl: '/banner/HoodSkool_банер 1 _resized.jpg',
        altText: 'Classic Black Hoodie Back View',
        order: 1,
        isPrimary: false,
      },
    ],
    variants: [
      { id: 'var-1', size: 'S', sku: 'BH-001-S', stockCount: 15, inStock: true },
      { id: 'var-2', size: 'M', sku: 'BH-001-M', stockCount: 25, inStock: true },
      { id: 'var-3', size: 'L', sku: 'BH-001-L', stockCount: 30, inStock: true },
      { id: 'var-4', size: 'XL', sku: 'BH-001-XL', stockCount: 20, inStock: true },
      { id: 'var-5', size: 'XXL', sku: 'BH-001-XXL', stockCount: 10, inStock: true },
    ],
    sku: 'BH-001',
    inStock: true,
    totalStock: 100,
    lowStockAlert: 10,
    tags: ['streetwear', 'hoodie', 'classic', 'embroidered'],
    colors: ['Black'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    materials: ['100% Cotton', 'Heavyweight Fabric'],
    details: {
      weight: '450gsm',
      fit: 'Relaxed',
      origin: 'Made in Lithuania',
    },
    isNew: true,
    isFeatured: true,
    isBestseller: true,
    careInstructions: 'Machine wash cold, tumble dry low. Do not bleach.',
    sizeGuide: 'S: Chest 36-38", M: Chest 38-40", L: Chest 40-42", XL: Chest 42-44", XXL: Chest 44-46"',
    viewCount: 245,
    salesCount: 67,
  },
  {
    name: 'Oversized Cream Hoodie',
    slug: 'oversized-cream-hoodie',
    description: 'Ultra-soft oversized hoodie in cream colorway. Features dropped shoulders, extended sleeves, and a boxy fit for maximum comfort. Premium quality with screen-printed graphics on chest and back.',
    shortDescription: 'Ultra-soft oversized hoodie in cream colorway',
    price: 85.00,
    category: 'Clothings',
    subCategory: 'Hood Wears',
    itemType: 'Hoodies',
    categoryPath: '/clothings/hood-wears/hoodies',
    images: [
      {
        id: 'img-3',
        publicId: 'hoodskool/hoodies/cream-hoodie-1',
        url: '/HoodSkool_Catalog_0408202312555 1_resized.jpg',
        secureUrl: '/HoodSkool_Catalog_0408202312555 1_resized.jpg',
        altText: 'Oversized Cream Hoodie Front',
        order: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-6', size: 'M', sku: 'CH-002-M', stockCount: 18, inStock: true },
      { id: 'var-7', size: 'L', sku: 'CH-002-L', stockCount: 22, inStock: true },
      { id: 'var-8', size: 'XL', sku: 'CH-002-XL', stockCount: 15, inStock: true },
    ],
    sku: 'CH-002',
    inStock: true,
    totalStock: 55,
    tags: ['oversized', 'hoodie', 'cream', 'graphics'],
    colors: ['Cream'],
    sizes: ['M', 'L', 'XL'],
    materials: ['80% Cotton', '20% Polyester'],
    isNew: true,
    isFeatured: true,
    viewCount: 189,
    salesCount: 43,
  },

  // T-SHIRTS
  {
    name: 'Graphic Tee - Street Edition',
    slug: 'graphic-tee-street-edition',
    description: 'Bold graphic t-shirt featuring original street art design. Made from premium ring-spun cotton for superior comfort and durability. Screen-printed with eco-friendly inks.',
    shortDescription: 'Bold graphic t-shirt with original street art design',
    price: 35.00,
    compareAtPrice: 45.00,
    discountPercent: 22,
    category: 'Clothings',
    subCategory: 'Hood Wears',
    itemType: 'T-Shirts',
    categoryPath: '/clothings/hood-wears/t-shirts',
    images: [
      {
        id: 'img-4',
        publicId: 'hoodskool/tshirts/graphic-tee-1',
        url: '/DSC05257 (1).jpg',
        secureUrl: '/DSC05257 (1).jpg',
        altText: 'Graphic Tee Street Edition',
        order: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-9', size: 'S', sku: 'GT-003-S', stockCount: 20, inStock: true },
      { id: 'var-10', size: 'M', sku: 'GT-003-M', stockCount: 35, inStock: true },
      { id: 'var-11', size: 'L', sku: 'GT-003-L', stockCount: 30, inStock: true },
      { id: 'var-12', size: 'XL', sku: 'GT-003-XL', stockCount: 25, inStock: true },
    ],
    sku: 'GT-003',
    inStock: true,
    totalStock: 110,
    tags: ['graphic', 't-shirt', 'street-art', 'print'],
    colors: ['Black', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    materials: ['100% Ring-Spun Cotton'],
    isBestseller: true,
    viewCount: 312,
    salesCount: 98,
  },
  {
    name: 'Essential White Tee',
    slug: 'essential-white-tee',
    description: 'Clean and minimal white t-shirt perfect for any occasion. Features a comfortable regular fit with reinforced shoulder seams and high-quality stitching throughout.',
    shortDescription: 'Clean minimal white t-shirt for any occasion',
    price: 28.00,
    category: 'Clothings',
    subCategory: 'Hood Wears',
    itemType: 'T-Shirts',
    categoryPath: '/clothings/hood-wears/t-shirts',
    images: [
      {
        id: 'img-5',
        publicId: 'hoodskool/tshirts/white-tee-1',
        url: '/HoodSkool_0408202445315 - Copy.jpg',
        secureUrl: '/HoodSkool_0408202445315 - Copy.jpg',
        altText: 'Essential White Tee',
        order: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-13', size: 'S', sku: 'WT-004-S', stockCount: 25, inStock: true },
      { id: 'var-14', size: 'M', sku: 'WT-004-M', stockCount: 40, inStock: true },
      { id: 'var-15', size: 'L', sku: 'WT-004-L', stockCount: 35, inStock: true },
      { id: 'var-16', size: 'XL', sku: 'WT-004-XL', stockCount: 20, inStock: true },
    ],
    sku: 'WT-004',
    inStock: true,
    totalStock: 120,
    tags: ['essential', 't-shirt', 'basic', 'white'],
    colors: ['White'],
    sizes: ['S', 'M', 'L', 'XL'],
    materials: ['100% Cotton'],
    isBestseller: true,
    viewCount: 456,
    salesCount: 134,
  },

  // PANTS
  {
    name: 'Urban Cargo Pants',
    slug: 'urban-cargo-pants',
    description: 'Functional cargo pants with multiple pockets and adjustable waist. Made from durable cotton twill with reinforced knees. Perfect blend of style and utility.',
    shortDescription: 'Functional cargo pants with multiple pockets',
    price: 95.00,
    category: 'Clothings',
    subCategory: 'Hood Wears',
    itemType: 'Pants',
    categoryPath: '/clothings/hood-wears/pants',
    images: [
      {
        id: 'img-6',
        publicId: 'hoodskool/pants/cargo-1',
        url: '/HoodSkool_Catalog_0408202313209_resized.jpg',
        secureUrl: '/HoodSkool_Catalog_0408202313209_resized.jpg',
        altText: 'Urban Cargo Pants',
        order: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-17', size: '28', sku: 'CP-005-28', stockCount: 10, inStock: true },
      { id: 'var-18', size: '30', sku: 'CP-005-30', stockCount: 15, inStock: true },
      { id: 'var-19', size: '32', sku: 'CP-005-32', stockCount: 20, inStock: true },
      { id: 'var-20', size: '34', sku: 'CP-005-34', stockCount: 15, inStock: true },
      { id: 'var-21', size: '36', sku: 'CP-005-36', stockCount: 10, inStock: true },
    ],
    sku: 'CP-005',
    inStock: true,
    totalStock: 70,
    tags: ['cargo', 'pants', 'utility', 'streetwear'],
    colors: ['Black', 'Olive'],
    sizes: ['28', '30', '32', '34', '36'],
    materials: ['Cotton Twill', 'Reinforced Knees'],
    isNew: true,
    viewCount: 178,
    salesCount: 45,
  },

  // ACCESSORIES
  {
    name: 'Bucket Hat - Classic',
    slug: 'bucket-hat-classic',
    description: 'Unstructured bucket hat made from premium cotton twill. Features embroidered logo and adjustable chin strap. One size fits most.',
    shortDescription: 'Unstructured bucket hat in premium cotton',
    price: 35.00,
    category: 'Accessories',
    itemType: 'Bucket Hats',
    categoryPath: '/accessories/bucket-hats',
    images: [
      {
        id: 'img-7',
        publicId: 'hoodskool/accessories/bucket-hat-1',
        url: '/DSC09599.jpg',
        secureUrl: '/DSC09599.jpg',
        altText: 'Bucket Hat Classic',
        order: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-22', size: 'One Size', sku: 'BH-006-OS', stockCount: 50, inStock: true },
    ],
    sku: 'BH-006',
    inStock: true,
    totalStock: 50,
    tags: ['bucket-hat', 'accessory', 'headwear'],
    colors: ['Black', 'Navy', 'Beige'],
    sizes: ['One Size'],
    materials: ['100% Cotton Twill'],
    isFeatured: true,
    viewCount: 234,
    salesCount: 76,
  },
  {
    name: 'Logo Cap',
    slug: 'logo-cap',
    description: 'Classic 6-panel cap with embroidered front logo. Adjustable back strap for perfect fit. Curved brim and breathable cotton construction.',
    shortDescription: 'Classic 6-panel cap with embroidered logo',
    price: 30.00,
    category: 'Accessories',
    itemType: 'Caps',
    categoryPath: '/accessories/caps',
    images: [
      {
        id: 'img-8',
        publicId: 'hoodskool/accessories/cap-1',
        url: '/banner/HoodSkool_банер 1 _resized.jpg',
        secureUrl: '/banner/HoodSkool_банер 1 _resized.jpg',
        altText: 'Logo Cap',
        order: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-23', size: 'One Size', sku: 'CAP-007-OS', stockCount: 60, inStock: true },
    ],
    sku: 'CAP-007',
    inStock: true,
    totalStock: 60,
    tags: ['cap', 'hat', 'accessory', 'logo'],
    colors: ['Black', 'White', 'Navy'],
    sizes: ['One Size'],
    materials: ['100% Cotton'],
    isBestseller: true,
    viewCount: 389,
    salesCount: 112,
  },

  // BESPOKE
  {
    name: 'Custom Tailored Suit',
    slug: 'custom-tailored-suit',
    description: 'Premium made-to-measure suit crafted from Italian wool. Includes jacket and trousers with full lining and hand-stitched details. Perfect for special occasions.',
    shortDescription: 'Premium made-to-measure suit in Italian wool',
    price: 450.00,
    compareAtPrice: 650.00,
    discountPercent: 31,
    category: 'Clothings',
    subCategory: 'Bespoke/Tailoring',
    itemType: 'Suits',
    categoryPath: '/clothings/bespoke/suits',
    images: [
      {
        id: 'img-9',
        publicId: 'hoodskool/bespoke/suit-1',
        url: '/HoodSkool_0408202445315 - Copy.jpg',
        secureUrl: '/HoodSkool_0408202445315 - Copy.jpg',
        altText: 'Custom Tailored Suit',
        order: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-24', size: '36', sku: 'SU-008-36', stockCount: 3, inStock: true },
      { id: 'var-25', size: '38', sku: 'SU-008-38', stockCount: 5, inStock: true },
      { id: 'var-26', size: '40', sku: 'SU-008-40', stockCount: 4, inStock: true },
      { id: 'var-27', size: '42', sku: 'SU-008-42', stockCount: 3, inStock: true },
    ],
    sku: 'SU-008',
    inStock: true,
    totalStock: 15,
    lowStockAlert: 5,
    tags: ['bespoke', 'suit', 'tailored', 'formal'],
    colors: ['Navy', 'Charcoal', 'Black'],
    sizes: ['36', '38', '40', '42'],
    materials: ['Italian Wool', 'Full Canvas Construction'],
    isLimitedEdition: true,
    isFeatured: true,
    viewCount: 87,
    salesCount: 12,
  },

  // CANDLES
  {
    name: 'Hood Essence Candle',
    slug: 'hood-essence-candle',
    description: 'Hand-poured soy wax candle with custom fragrance blend. Burns for 40+ hours with natural wood wick. Comes in matte black glass vessel.',
    shortDescription: 'Hand-poured soy candle with custom fragrance',
    price: 45.00,
    category: 'Candles & Matches',
    categoryPath: '/candles-matches',
    images: [
      {
        id: 'img-10',
        publicId: 'hoodskool/candles/candle-1',
        url: '/DSC09599.jpg',
        secureUrl: '/DSC09599.jpg',
        altText: 'Hood Essence Candle',
        order: 0,
        isPrimary: true,
      },
    ],
    variants: [
      { id: 'var-28', sku: 'CAN-009', stockCount: 30, inStock: true },
    ],
    sku: 'CAN-009',
    inStock: true,
    totalStock: 30,
    tags: ['candle', 'home', 'fragrance', 'handmade'],
    colors: ['Black'],
    sizes: [],
    materials: ['Soy Wax', 'Wood Wick', 'Glass'],
    details: {
      'Burn Time': '40+ hours',
      Scent: 'Sandalwood & Vanilla',
      Weight: '8oz',
    },
    isNew: true,
    isFeatured: true,
    viewCount: 156,
    salesCount: 34,
  },
];

async function seedProducts() {
  console.log('🌱 Starting product seeding...\n');

  const batch = db.batch();
  let count = 0;

  for (const productData of products) {
    const productRef = db.collection('products').doc();
    const productId = productRef.id;

    const product = {
      id: productId,
      ...productData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    batch.set(productRef, product);
    count++;

    console.log(`✅ Added: ${product.name} (${product.sku})`);
  }

  await batch.commit();

  console.log(`\n✨ Successfully seeded ${count} products!`);
  console.log('🎉 Database is ready for testing!\n');
}

// Run the seeding function
seedProducts()
  .then(() => {
    console.log('✅ Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  });