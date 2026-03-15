const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const router = require("./routes/user.js"); 
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 6969;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the F.A.S API!" });
});