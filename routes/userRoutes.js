const express = require('express');
const router = express.Router();

const {createUser, login, forgotPassword} = require("../controllers/userController");
const authMiddleware = require('../middlewares/auth');

router.post("/signup", createUser);
router.post("/login",login);
router.put("/forgot-password",forgotPassword);
router.get("/check-token", authMiddleware, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      role: req.user.role,
    },
  });
});




module.exports = router