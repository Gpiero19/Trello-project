const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);

// dummy test for auth
// router.get('/test', (req, res) => {
//   res.json({ message: "Auth test route working!" });
// });

module.exports = router;
