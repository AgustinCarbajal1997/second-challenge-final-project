const User = require("../models/user");
const Purchase = require("../models/purchases");
class ContainerPurchases {
  async getPurchases(userId) {
    try {
      const dataUser = await User.findById(userId);
      if (!dataUser.purchases.length) return { message: "No purchases yet" };
      const dataPurchases = await Purchase.find({
        _id: { $in: [...dataUser.purchases] },
      });
      return {
        status: 200,
        message: "Successfull request",
        dataPurchases,
      };
    } catch (error) {
      throw {
        status: 500,
        message: `Something have gone wrong. Unsuccessful action. ${error.message}`,
      };
    }
  }

  async confirmPurchase(userId, dataBuyer) {
    try {
      const dataUser = await User.findById(userId);
      const total = dataUser.cart.reduce(
        (ac, item) => ac + item.quantity * item.price,
        0
      );
      const newPurchase = new Purchase({
        ...dataBuyer,
        products: dataUser.cart,
        total,
      });
      const dataPurchase = await newPurchase.save();
      const newData = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            purchases: dataPurchase.id,
          },
          $set: {
            cart: [],
          },
        },
        { new: true }
      );
      return {
        status: 200,
        message: "Successfull request",
        dataUser: newData,
      };
    } catch (error) {
      throw {
        status: 500,
        message: `Something have gone wrong. Unsuccessful action. ${error.message}`,
      };
    }
  }
}

module.exports = ContainerPurchases;
