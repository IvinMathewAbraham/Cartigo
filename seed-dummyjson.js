import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching data from DummyJSON...");
  const response = await fetch("https://dummyjson.com/products?limit=30");
  const data = await response.json();
  const products = data.products;

  console.log(`Fetched ${products.length} products. Seeding database...`);

  for (const item of products) {
    // 1. Ensure Brand exists
    const brandName = item.brand || "Generic";
    const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    const brand = await prisma.brand.upsert({
      where: { slug: brandSlug },
      update: {},
      create: { name: brandName, slug: brandSlug, description: `Brand: ${brandName}` },
    });

    // 2. Ensure Category exists
    const categoryName = item.category.replace(/-/g, " ");
    const categorySlug = item.category;

    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {},
      create: { name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1), slug: categorySlug },
    });

    // 3. Create Product
    const productSlug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + item.id;
    
    const product = await prisma.product.upsert({
      where: { slug: productSlug },
      update: {},
      create: {
        name: item.title,
        slug: productSlug,
        description: item.description,
        brand_id: brand.id,
        primary_category_id: category.id,
      },
    });

    // 4. Create Product Variant
    const variant = await prisma.productVariant.upsert({
      where: { sku: item.sku },
      update: {},
      create: {
        productId: product.id,
        sku: item.sku,
        price: item.price,
      },
    });

    // 5. Create Images
    if (item.images && item.images.length > 0) {
      for (let i = 0; i < item.images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: item.images[i],
            alt_text: `${item.title} image ${i + 1}`,
            isPrimary: i === 0,
            display_order: i + 1,
          },
        });
      }
    } else if (item.thumbnail) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: item.thumbnail,
          alt_text: item.title,
          isPrimary: true,
          display_order: 1,
        },
      });
    }

    // 6. Create Inventory
    await prisma.inventory.upsert({
      where: { variant_id: variant.id },
      update: { quantity: item.stock },
      create: {
        variant_id: variant.id,
        quantity: item.stock,
      },
    });

    console.log(`Seeded product: ${item.title}`);
  }

  console.log("DummyJSON seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
