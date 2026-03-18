import express from "express";
import auth from "../middleware/auth.js";

import {
  getUserDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
  shareDesign,
  getSharedDesign,
} from "../controllers/designController.js";

const router = express.Router();

router.get("/user", auth, getUserDesigns);
router.get("/:id", auth, getDesignById);
router.post("/", auth, createDesign);
router.put("/:id", auth, updateDesign);
router.delete("/:id", auth, deleteDesign);
router.put("/:id/share", auth, shareDesign);

// Public route
router.get("/shared/:shareId", getSharedDesign);

export default router;