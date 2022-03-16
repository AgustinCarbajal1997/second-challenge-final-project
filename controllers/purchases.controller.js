const purchase = require("../services/purchases.services");
const getPurchases = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const data = await purchase.getPurchases(userId);
    return res.status(data.status).json(data);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};
const confirmPurchase = async (req, res) => {
  const { id: userId } = req.user;
  const dataBuyer = req.body.dataBuyer;
  try {
    const data = await purchase.confirmPurchase(userId, dataBuyer);
    return res.status(data.status).json(data);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};
module.exports = {
  getPurchases,
  confirmPurchase,
};
