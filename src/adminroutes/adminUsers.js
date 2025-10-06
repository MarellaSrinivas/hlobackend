import express from "express";
import pool from "../models/db.js";
import { verifyAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Get all users
router.get("/", verifyAdmin, async (req, res) => {
  const result = await pool.query("SELECT  id, name, email, phone FROM users WHERE user_type='user' ");
  res.json(result.rows);
});

// Delete user
router.delete("/:id", verifyAdmin, async (req, res) => {
  await pool.query("DELETE FROM users WHERE  id=$1", [req.params.id]);
  res.json({ message: "User deleted" });
});

export default router;
