import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding comprehensive e-commerce data...");
  // ==========================================
  // 1. ROLES & PERMISSIONS
  // ==========================================
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: "CUSTOMER" },
    update: {},
    create: { name: "CUSTOMER" },
  });

  const manageCatalogPerm = await prisma.permission.upsert({
    where: { name: "MANAGE_CATALOG" },
    update: {},
    create: { name: "MANAGE_CATALOG", description: "Allows managing products and categories" },
  });

  await prisma.role_permission.createMany({
    data: [
      { role_id: adminRole.id, permission_id: manageCatalogPerm.id },
    ],
    skipDuplicates: true,
  });

  // ==========================================
  // 2. USERS & ROLES
  // ==========================================
  const passwordHash = await bcrypt.hash("Password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash,
      firstName: "Admin",
      lastName: "System",
      phone: "1234567890",
      is_verified: true,
      is_active: true,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      passwordHash,
      firstName: "John",
      lastName: "Doe",
      phone: "9876543210",
      is_verified: true,
      is_active: true,
    },
  });

  await prisma.user_role.createMany({
    data: [
      { user_id: admin.id, role_id: adminRole.id },
      { user_id: customer.id, role_id: customerRole.id },
    ],
    skipDuplicates: true,
  });

  // ==========================================
  // 3. ADDRESSES
  // ==========================================
  await prisma.address.create({
    data: {
      userId: customer.id,
      label: "Home",
      addressLine1: "123 Main Street",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
      isDefault: true,
    },
  });

  // ==========================================
  // 4. CATEGORIES & BRANDS
  // ==========================================
  const electronics = await prisma.category.create({
    data: { name: "Electronics", slug: "electronics", description: "Gadgets and tech" },
  });

  const mobiles = await prisma.category.create({
    data: {
      name: "Mobiles",
      slug: "mobiles",
      description: "Smartphones",
      parentId: electronics.id
    },
  });

  const apple = await prisma.brand.create({
    data: { name: "Apple", slug: "apple", description: "Think Different" },
  });

  const samsung = await prisma.brand.create({
    data: { name: "Samsung", slug: "samsung", description: "Inspire the World" },
  });

  // ==========================================
  // 5. ATTRIBUTES & VALUES
  // ==========================================
  const colorAttr = await prisma.productAttribute.create({ data: { name: "Color" } });
  const storageAttr = await prisma.productAttribute.create({ data: { name: "Storage" } });

  const blackValue = await prisma.productAttributeValue.create({ data: { attributeId: colorAttr.id, value: "Space Black" } });
  const whiteValue = await prisma.productAttributeValue.create({ data: { attributeId: colorAttr.id, value: "Titanium White" } });
  const storage256 = await prisma.productAttributeValue.create({ data: { attributeId: storageAttr.id, value: "256GB" } });

  // ==========================================
  // 6. PRODUCTS, IMAGES, VARIANTS
  // ==========================================
  const iphone = await prisma.product.create({
    data: {
      name: "iPhone 16 Pro",
      slug: "iphone-16-pro",
      description: "Latest flagship from Apple.",
      brand_id: apple.id,
      primary_category_id: mobiles.id,
    },
  });

  await prisma.productImage.createMany({
    data: [
      {
        productId: iphone.id,
        url: "uploads/products/iphone16pro-front.jpg",
        alt_text: "iPhone 16 Pro Front View",
        isPrimary: true,
        display_order: 1
      },
      {
        productId: iphone.id,
        url: "uploads/products/iphone16pro-back.jpg",
        alt_text: "iPhone 16 Pro Back View",
        isPrimary: false,
        display_order: 2
      },
    ],
  });
  // Variant 1: Black / 256 GB
  const iphoneBlack256 = await prisma.productVariant.create({
    data: {
      productId: iphone.id,
      sku: "IPH16P-BLK-256",
      price: 1199.99,
    },
  });

  // Variant 2: White / 256 GB
  const iphoneWhite256 = await prisma.productVariant.create({
    data: {
      productId: iphone.id,
      sku: "IPH16P-WHT-256",
      price: 1199.99,
    },
  });

  // Map attributes to variants
  await prisma.variantAttributeValue.createMany({
    data: [
      { variantId: iphoneBlack256.id, attributeValueId: blackValue.id },
      { variantId: iphoneBlack256.id, attributeValueId: storage256.id },
      { variantId: iphoneWhite256.id, attributeValueId: whiteValue.id },
      { variantId: iphoneWhite256.id, attributeValueId: storage256.id },
    ],
  });

  // ==========================================
  // 7. INVENTORY
  // ==========================================
  await prisma.inventory.createMany({
    data: [
      { variant_id: iphoneBlack256.id, quantity: 50 },
      { variant_id: iphoneWhite256.id, quantity: 35 },
    ],
  });

  // Log inventory event tracking history
  await prisma.inventoryHistory.create({
    data: {
      variantId: iphoneBlack256.id,
      quantity_before: 0,
      quantity_after: 50,
      quantityChange: 50,
      changeType: "RESTOCK",
      note: "Initial system ingestion load",
      performed_by: admin.id,
    },
  });

  // ==========================================
  // 8. COUPONS
  // ==========================================
  const coupon = await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      discount_type: "PERCENTAGE",
      discount_value: 10.00,
      minimum_order_amount: 100.00,
      is_active: true,
      start_date: new Date(),
      expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days from now
    },
  });

  // ==========================================
  // 9. ORDERS & ORDER ITEMS
  // ==========================================
  const order = await prisma.order.create({
    data: {
      userId: customer.id,
      totalAmount: 1199.99,
      status: "DELIVERED",
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      variantId: iphoneBlack256.id,
      sku: iphoneBlack256.sku,
      productName: "iPhone 16 Pro (Space Black, 256GB)",
      quantity: 1,
      price: 1199.99,
    },
  });

  await prisma.order_status_history.create({
    data: {
      order_id: order.id,
      old_status: "PENDING",
      new_status: "DELIVERED",
    },
  });

  // Track product purchase history
  await prisma.product_purchase_history.create({
    data: {
      user_id: customer.id,
      variant_id: iphoneBlack256.id,
    },
  });

  // ==========================================
  // 10. REVIEWS & RATINGS
  // ==========================================
  const review = await prisma.review.create({
    data: {
      variant_id: iphoneBlack256.id,
      user_id: customer.id,
      rating: 5,
      title: "Amazing Device!",
      body: "The camera system is a significant upgrade. Absolutely love the screen.",
    },
  });

  await prisma.product_review_summary.create({
    data: {
      product_id: iphone.id,
      average_rating: 5.00,
      total_reviews: 1,
    },
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });