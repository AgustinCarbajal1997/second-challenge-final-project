const user = require("../services/user.services");
const getDataUser = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const data = await user.getDataUser(userId);
    return res.status(data.status).json(data);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = {
    getDataUser
}