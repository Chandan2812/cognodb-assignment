const express = require("express");

const { getAllSkillsController } = require("../controllers/skillController");

const router = express.Router();

router.get("/", getAllSkillsController);

module.exports = router;
