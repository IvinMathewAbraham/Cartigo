// services/brand.service.js

import prisma from "../config/client.js";

export const getBrands = async () => {
  return prisma.brand.findMany({
    orderBy: {
      name: "asc",
    },

    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
};