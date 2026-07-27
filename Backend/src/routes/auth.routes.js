const {Router} = require("express");
const authController = require("../controllers/auth.controllers")


const router = Router();

router.post('/register', authController.registerUser)

router.post('/login', authController.loginUser)

router.get("/get-me")

module.exports = router;

