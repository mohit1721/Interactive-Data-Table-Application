// routes/dataRoutes.js

const express = require("express");
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');

const { getData } = require("../controllers/dataController"); // Import the controller
router.use(authenticate);
router.get("/data", getData); // Define route and link it to the controller

module.exports = router;
