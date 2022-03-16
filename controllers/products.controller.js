const products = require("../services/products.services");
const getAll = async (req, res) => {
  try {
    const data = await products.getAll();
    return res.status(data.status).json(data);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};
const getById = async (req, res) => {
  try {
    const data = await products.getById(req.params.id);
    return res.status(data.status).json(data);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

const getSeveralIds = async (req, res) => {
  try {
    const data = await products.getSeveralIds(req.query.q);
    return res.status(data.status).json(data);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};
const getByDiscount = async (req, res) => {
  try {
    const data = await products.getByDiscount(req.params.discount);
    return res.status(data.status).json(data);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

const getByCategory = async (req, res) => {
  const { category } = req.params;
  const { orderBy } = req.query;
  const brandType = req.query.brandType || [/^/];
  try {
    const data = await products.getByCategory(category, orderBy, brandType);
    return res.status(data.status).json(data);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};
const generalSearch = async (req, res) => {
  const { q, limit } = req.query;
  try {
    const data = await products.generalSearch(q, limit);
    return res.status(data.status).json(data);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};
const getComparison = async (req, res) => {
  try {
    const data = await products.getComparison(req.query.q);
    return res.status(data.status).json(data);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};
const getFavorites = async (req, res) => {
  try {
    const data = await products.getFavorites();
    return res.status(data.status).json(data);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};
const setFavorites = async (req, res) => {
  const { productId } = req.body;
  const { id: userId } = req.user;
  try {
    const data = await products.setFavorites(userId, productId);
    return res.status(data.status).json(data);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  getSeveralIds,
  getByDiscount,
  getByCategory,
  generalSearch,
  getComparison,
  getFavorites,
  setFavorites,
};
