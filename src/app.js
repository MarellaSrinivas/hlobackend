import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"; 
import hostelRoutes from "./routes/hostelRoutes.js";
 
const app = express();

app.use(cors());
app.use(express.json());

// Authentication Routes  for user, hostel owner login and signup
app.use("/api/auth", authRoutes);

//Routes for getting hostels in home page and5 individual pages

app.use("/api/hostel", hostelRoutes);
 
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});



 
export default app;
