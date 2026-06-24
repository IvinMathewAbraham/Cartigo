// services/inventory.service.js

import prisma from "../config/client.js";


export const createInventory = async (
  variantId,
  quantity,
  userId
) => {
  const inventory =
    await prisma.inventory.create({
      data: {
        variant_id: BigInt(variantId),
        quantity,
      },
    });

  await prisma.inventoryHistory.create({
    data: {
      variantId: BigInt(variantId),

      quantity_before: 0,

      quantity_after: quantity,

      quantityChange: quantity,

      changeType: "RESTOCK",

      performed_by: BigInt(userId),

      note: "Initial stock",
    },
  });

  return inventory;
};


export const updateInventory = async (
  variantId,
  quantity,
  changeType,
  note,
  userId
) => {
  return prisma.$transaction(
    async (tx) => {
      const inventory =
        await tx.inventory.findUnique({
          where: {
            variant_id:
              BigInt(variantId),
          },
        });

      if (!inventory) {
        throw new Error(
          "Inventory not found"
        );
      }

      const quantityBefore =
        inventory.quantity;

      const quantityAfter =
        Number(quantity);

      const quantityChange =
        quantityAfter -
        quantityBefore;

      const updatedInventory =
        await tx.inventory.update({
          where: {
            variant_id:
              BigInt(variantId),
          },
          data: {
            quantity: quantityAfter,
            last_updated:
              new Date(),
          },
        });

      await tx.inventoryHistory.create({
        data: {
          variantId:
            BigInt(variantId),

          performed_by:
            BigInt(userId),

          quantity_before:
            quantityBefore,

          quantity_after:
            quantityAfter,

          quantityChange,

          changeType,

          note,
        },
      });

      return updatedInventory;
    }
  );
};