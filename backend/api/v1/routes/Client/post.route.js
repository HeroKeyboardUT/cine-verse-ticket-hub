const express = require("express");
const router = express.Router();    
const controller = require("../../controllers/Client/post.controller");

router.get("/", controller.index);

router.get("/detail/:id",controller.detail);


module.exports = router;