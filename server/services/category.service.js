// services/category.service.js

import prisma from "../config/client.js";

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },

    select: {
      id: true,
      name: true,
      slug: true,
      parentId: true,
    },
  });
};