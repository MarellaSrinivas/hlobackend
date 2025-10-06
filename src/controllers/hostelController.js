import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";
import pool from "../models/db.js";
 

// Generic function for fetching hostels
const fetchHostelsByQuery = async (res, query, params = []) => {
  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Get Hostels Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Popular hostels
export const getHostels = async (req, res) => {
  await fetchHostelsByQuery(res, "SELECT * FROM hostels");
  
};

// Hyderabad hostels
export const hydHostels = async (req, res) => {
  await fetchHostelsByQuery(res, "SELECT * FROM hostels WHERE city = $1", ["Hyderabad"]);
};

// Chennai hostels
export const cheHostels = async (req, res) => {
  await fetchHostelsByQuery(res, "SELECT * FROM hostels WHERE city = $1", ["Chennai"]);
};

// Bangalore hostels
export const benHostels = async (req, res) => {
  await fetchHostelsByQuery(res, "SELECT * FROM hostels WHERE city = $1", ["Bangalore"]);
};



// GET hostel by ID (debug version)
export const getHostelById = async (req, res) => {
  const { id } = req.params;
  console.log("🔹 Requested hostel ID:", id);

  try {
    const queryText = "SELECT * FROM hostels WHERE hostel_id = $1";
    console.log("🔹 Running query:", queryText, "with value:", id);

    const result = await pool.query(queryText, [id]);
    console.log("🔹 Query result rows:", result.rows);

    if (result.rows.length === 0) {
      console.warn("⚠️ Hostel not found for ID:", id);
      return res.status(404).json({ ok: false, message: "Hostel not found" });
    }

    console.log("✅ Hostel found:", result.rows[0]);
    return res.json({ ok: true, data: result.rows[0] });

  } catch (error) {
    console.error("❌ Error fetching hostel:", error.message, error);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};


export const foodMenu = async (req, res) => {
const { hostelId } = req.params;

  try {
    const result = await pool.query(
      "SELECT day, breakfast, lunch, dinner FROM food_menus WHERE hostel_id = $1",
      [hostelId]
    );

    if (result.rows.length === 0) {
      return res.json({ ok: true, data: {} }); // ✅ return empty instead of error
    }

  
    res.json({ ok: true, data: result.rows[0] });
  } catch (err) {
    console.error("DB Error:", err);
    res.json({ ok: false, message: "Error fetching food menu" });
  }
};