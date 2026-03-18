import Design from "../models/Design.js";
import crypto from "crypto";

// Get user's designs
export const getUserDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.userId })
      .sort({ updatedAt: -1 });

    res.json(designs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single design
export const getDesignById = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ error: "Design not found" });
    }

    if (design.userId && design.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(design);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create design
export const createDesign = async (req, res) => {
  try {
    const { name, room, items, thumbnail } = req.body;

    const design = new Design({
      name,
      userId: req.userId,
      room,
      items,
      thumbnail,
      shareId: crypto.randomBytes(8).toString("hex"),
    });

    await design.save();

    res.status(201).json(design);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update design
export const updateDesign = async (req, res) => {
  try {
    const { name, room, items, thumbnail } = req.body;

    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ error: "Design not found" });
    }

    if (design.userId && design.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    design.name = name || design.name;
    design.room = room || design.room;
    design.items = items || design.items;
    design.thumbnail = thumbnail || design.thumbnail;
    design.updatedAt = Date.now();

    await design.save();

    res.json(design);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete design
export const deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ error: "Design not found" });
    }

    if (design.userId && design.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Design.findByIdAndDelete(req.params.id);

    res.json({ message: "Design deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Share design
export const shareDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ error: "Design not found" });
    }

    if (design.userId && design.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    design.shareId = crypto.randomBytes(8).toString("hex");
    design.isPublic = true;

    await design.save();

    const shareLink = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/share/${design.shareId}`;

    res.json({ link: shareLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get shared design
export const getSharedDesign = async (req, res) => {
  try {
    const design = await Design.findOne({
      shareId: req.params.shareId,
      isPublic: true,
    });

    if (!design) {
      return res.status(404).json({ error: "Design not found" });
    }

    res.json(design);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};