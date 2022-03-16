const express = require("express");
const router = express.Router();
const ContainerAuthentication = require("../containers/ContainerAuth");
const ContainerAuth = new ContainerAuthentication();
const cart = require("../controllers/cart.controllers");

router
  .post("/postProductCart", ContainerAuth.auth, cart.postProductCart)
  .delete("/deleteProductCart", ContainerAuth.auth, cart.deleteProductCart);

module.exports = router;
