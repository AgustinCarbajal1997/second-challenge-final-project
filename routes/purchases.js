const express = require("express");
const router = express.Router();
const ContainerAuthentication = require("../containers/ContainerAuth");
const ContainerAuth = new ContainerAuthentication();
const purchase = require("../controllers/purchases.controller");

router
  .get("/getPurchases", ContainerAuth.auth, purchase.getPurchases)
  .post("/confirmPurchase", ContainerAuth.auth, purchase.confirmPurchase);

module.exports = router;
