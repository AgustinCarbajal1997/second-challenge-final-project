const express = require("express");
const router = express.Router();
const ContainerAuthentication = require("../containers/ContainerAuth");
const ContainerAuth = new ContainerAuthentication();
const products = require("../controllers/products.controller");

router
  .get("/getAll", products.getAll)
  .get("/getById/:id", products.getById)
  .get("/getSeveralIds", products.getSeveralIds)
  .get("/getByDiscount/:discount", products.getByDiscount)
  .get("/getByCategory/:category", products.getByCategory)
  .get("/generalSearch", products.generalSearch)
  .get("/getComparison", products.getComparison)
  .get("/getFavorites", ContainerAuth.auth, products.getFavorites)
  .put("/setFavorites", ContainerAuth.auth, products.setFavorites);

module.exports = router;
