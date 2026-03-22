const express = require("express");
const router = express.Router();
const {check} = require("../middlewares/roleCheck")
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


const {
  addUser,
  deleteUser,
  getUsers,
  bulkUploadUsers
} = require("../controllers/userController");

router.get("/",check, getUsers);
router.post("/add",check, addUser);
router.delete("/:id",check, deleteUser);
router.post(
  "/bulk-upload",check,
  upload.single("file"),
  bulkUploadUsers
);

module.exports = router;
