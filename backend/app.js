const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRouter = require("./routes/users.js"); 
const availRoutes = require("./routes/avail.js");
const appmtRoutes = require("./routes/appmt.js");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/avail", availRoutes);
app.use("/api/appmt", appmtRoutes);

const PORT = process.env.PORT || 6969;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the F.A.S API!" });
});




