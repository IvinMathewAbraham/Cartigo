import prisma from "../config/client.js";

export const createAddress = async (
  userId,
  data
) => {

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: {
        userId: BigInt(userId),
      },

      data: {
        isDefault: false,
      },
    });
  }

  return prisma.address.create({
    data: {
      user: {
        connect: {
          id: BigInt(userId),
        },
      },

      label: data.label,

      addressLine1:
        data.addressLine1,

      addressLine2:
        data.addressLine2,

      city: data.city,

      state: data.state,

      postalCode:
        data.postalCode,

      country:
        data.country,

      isDefault:
        data.isDefault,
    },
  });
};

export const getAddresses = async (userId) => {
    return prisma.address.findMany({
      where: {
        userId: BigInt(userId),
      },

      orderBy: {
        isDefault: "desc",
      },
    });
  };

export const updateAddress = async (
  addressId,
  userId,
  data
) => {
  const existing =
    await prisma.address.findFirst({
      where: {
        id: BigInt(addressId),
        userId: BigInt(userId),
      },
    });

  if (!existing) {
    throw new Error(
      "Address not found"
    );
  }

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: {
        userId: BigInt(userId),
      },

      data: {
        isDefault: false,
      },
    });
  }

  return prisma.address.update({
    where: {
      id: BigInt(addressId),
    },

    data: {
      label: data.label,
      addressLine1:
        data.addressLine1,
      addressLine2:
        data.addressLine2,
      city: data.city,
      state: data.state,
      postalCode:
        data.postalCode,
      country: data.country,
      isDefault:
        data.isDefault,
    },
  });
};

export const deleteAddress = async (
    addressId,
    userId
  ) => {
    const existing =
      await prisma.address.findFirst({
        where: {
          id: BigInt(addressId),
          userId: BigInt(userId),
        },
      });

    if (!existing) {
      throw new Error(
        "Address not found"
      );
    }

    return prisma.address.delete({
      where: {
        id: BigInt(addressId),
      },
    });
  };