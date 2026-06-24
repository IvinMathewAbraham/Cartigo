import express from "express";
import { createInventory,updateInventory } from "../services/inventory.service.js";

// POST /api/admin/variants/:variantId/inventory
export const createInventoryController = async (req, res) => {
    try {
      const { variantId } =
        req.params;

      const { quantity } =
        req.body;

      if (
        quantity === undefined
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Quantity is required",
        });
      }

      const inventory =
        await createInventory(
          variantId,
          Number(quantity),
          req.user.id
        );

      return res.status(201).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// PATCH /api/admin/inventory/variants/:variantId/inventory
export const updateInventoryController =
  async (req, res) => {
    try {
      const { variantId } =
        req.params;

      const {
        quantity,
        changeType,
        note,
      } = req.body;

      const inventory =
        await updateInventory(
          variantId,
          quantity,
          changeType,
          note,
          req.user.id
        );

      return res.status(200).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };