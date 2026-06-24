// address.controller.js

import prisma from "../config/client.js";
import { createAddress,getAddresses,updateAddress,deleteAddress } from "../services/address.service.js";

// POST /api/addresses
export const createAddressController = async (req, res) => {
    try {
      const address =
        await createAddress(
          req.user.id,
          req.body
        );

      return res.status(201).json({
        success: true,
        data: address,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getAddressesController = async (req, res) => {
    try {
      const addresses =
        await getAddresses(
          req.user.id
        );

      return res.status(200).json({
        success: true,
        data: addresses,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// PUT /api/addresses/:id
export const updateAddressController = async (req, res) => {
    try {
      const { id } =
        req.params;

      const address =
        await updateAddress(
          id,
          req.user.id,
          req.body
        );

      return res.status(200).json({
        success: true,
        data: address,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// DELETE /api/addresses/:id
export const deleteAddressController = async (req, res) => {
    try {
      const { id } =
        req.params;

      await deleteAddress(
        id,
        req.user.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Address deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };