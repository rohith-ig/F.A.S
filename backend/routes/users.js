const express = require("express");
const router = express.Router();
const {check} = require("../middlewares/roleCheck")
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  addUser,
  deleteUser,
  getUsers,
  bulkUploadUsers,
  getIndividualUser,
  updateUser
} = require("../controllers/userController");

router.get("/",check, getUsers);
router.get("/get",check, getIndividualUser);
router.post("/add",check, addUser);
router.delete("/:id",check, deleteUser);
router.post(
  "/bulk-upload",check,
  upload.single("file"),
  bulkUploadUsers
);
router.put("/update-user/:id", check, updateUser);

module.exports = router;
