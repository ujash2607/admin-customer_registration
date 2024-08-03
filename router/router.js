const express = require('express');
const router = express.Router();
const controller = require("../controller/controller");
const authorized = require("../middleware/middleware");

router.post('/addCustomer',  controller.addCustomer);
router.post('/addAdmin', controller.addAdmin);
router.get('/verify-email', controller.verifyEmail);
router.post('/adminLogin', controller.adminLogin);


module.exports = router;