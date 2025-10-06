import express from "express";
import { registerUser, loginUser, registerOwner, loginOwner } from "../controllers/authController.js";

const router = express.Router();


router.post("/registeruser", registerUser);
router.post("/loginuser", loginUser);
router.post("/registerowner", registerOwner);
router.post("/loginowner", loginOwner);



export default router;
