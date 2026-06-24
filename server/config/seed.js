// prisma/seed.js

import prisma from "../config/client.js";

const brand = await prisma.brand.upsert({
  where: {
    name: "Apple",
  },
  update: {},
  create: {
    name: "Apple",
    slug: "apple",
  },
});

const category = await prisma.category.upsert({
  where: {
    slug: "mobiles",
  },
  update: {},
  create: {
    name: "Mobiles",
    slug: "mobiles",
  },
});

const product = await prisma.product.create({
    data: {
        name: "iPhone 15",
        slug: "iphone-15",
        description: "Latest Apple smartphone",
        is_active: true,

        brand: {
            connect: {
                id: brand.id,
            },
        },

        category: {
            connect: {
                id: category.id,
            },
        },
    },
});