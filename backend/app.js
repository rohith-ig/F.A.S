const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRouter = require("./routes/user.js"); 
const availRoutes = require("./routes/avail.js");
const appmtRoutes = require("./routes/appmt.js");
const adminRoutes = require("./routes/adminRoutes");
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/avail", availRoutes);
app.use("/api/appmt", appmtRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 6969;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the F.A.S API!" });
});