import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const token = jwt.sign(
  { userId: 4, role: "ADMIN" },
  process.env.JWT_SECRET,
  { expiresIn: "100y" }
);

console.log(token);