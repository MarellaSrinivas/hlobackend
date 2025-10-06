import express from "express";
import {  getHostels, hydHostels, cheHostels, benHostels, getHostelById, foodMenu} from "../controllers/hostelController.js";

const router = express.Router();


router.get("/gethostels", getHostels);
router.get("/hydhostels", hydHostels);
router.get("/chehostels", cheHostels);
router.get("/benhostels", benHostels);
router.get("/:id", getHostelById);
router.get("/:id/food_menu", foodMenu);


 

export default router;
