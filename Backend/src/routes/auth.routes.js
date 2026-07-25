const {Router} = require("express");
const authController = require("../controllers/auth.controllers")


const router = Router();

router.post('/register', authController.registerUser)

module.exports = router;

