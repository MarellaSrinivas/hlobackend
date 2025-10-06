import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";
import pool from "../models/db.js";

function generateOtp(length = 6) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, user_type } = req.body.formData;
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Insert user into DB (unverified initially)
    const userResult = await pool.query(
      `INSERT INTO users (name, email, phone, password, user_type, is_verified)
       VALUES ($1, $2, $3, $4, $5, false)
       RETURNING id, name, email, phone, user_type`,
      [name, email, phone, hashedPassword, user_type || "user"]
    );

    const user = userResult.rows[0];

    // 2. Generate OTP
    const otp = generateOtp();

    // 3. Store OTP in DB with expiry (5 minutes)
    await pool.query(
      `INSERT INTO otps (user_id, otp, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '5 minutes')`,
      [user.id, otp]
    );

    // // 4. Send OTP via Fast2SMS
    // try {
    //   const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
    //     headers: {
    //       authorization: process.env.FAST2SMS_API_KEY, // make sure .env is loaded
    //     },
    //     params: {
    //       variables_values: otp,  // OTP value
    //       route: "otp",
    //       numbers: phone,         // recipient phone number
    //     },
    //   });

    //   console.log("Fast2SMS Response:", response.data);
    // } catch (smsErr) {
    //   console.error("Fast2SMS Error:", smsErr.response?.data || smsErr.message);
    //   // Don’t block signup if SMS fails, just warn
    // }

    // 5. Respond to frontend
    res.status(201).json({
      message: "User registered. OTP sent to phone.",
      user,
    });

  } catch (err) {
    console.error("Register Error:", err.message);
    if (err.position) console.error("Error position:", err.position);
    res.status(500).json({ error: "Server error" });
  }
};



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body.formData;
    const userRes = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = userRes.rows[0];

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign({ id: user.id, user_type: user.user_type }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, user_type: user.user_type } });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};



export const registerOwner = async (req, res) => {
  try {
const { name, email, phone, password, user_type } = req.body.formData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO owners (name, email, phone, password, user_type)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, user_type`,
      [name, email,phone, hashedPassword,  user_type || "owner"]
    );
    
    RequestOtp();

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};




export const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body.formData;
    const ownerRes = await pool.query("SELECT * FROM owners WHERE email=$1", [email]);
    const owner = ownerRes.rows[0];

    if (!owner) return res.status(400).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, owner.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ id: owner.id, user_type: owner.user_type }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, owner: { id: owner.id, name: owner.name, email: owner.email, user_type: owner.user_type } });
 

    // Create JWT token 
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
