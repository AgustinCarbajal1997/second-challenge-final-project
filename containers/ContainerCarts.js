const User = require("../models/user");

class ContainerCarts {
  async getCart(userId) {
    try {
      const data = await User.findById(userId);
      return { cart: data.cart };
    } catch (error) {
      throw { message: `Something have gone wrong. ${error}` };
    }
  }
  // tratar de separar toda la logica cuando haga el daos, que todo pase a services y solo las consultas queden en daos
  async postCart(userId, dataProduct) {
    try {
      const data = await User.findById(userId);
      let cart = [...data.cart];
      if (cart.length) {
        const findProduct = data.cart.findIndex(
          (item) => item.productId === dataProduct.productId
        );
        findProduct === -1
          ? (cart = [...cart, dataProduct])
          : (cart[findProduct] = dataProduct);
      } else {
        cart = [...cart, dataProduct];
      }
      const query = {
        $set: {
          cart,
        },
      };
      const newData = await User.findByIdAndUpdate(userId, query, {
        new: true,
      });
      return {
        status: 200,
        message: "Successfully created",
        dataUser: newData,
      };
    } catch (error) {
      throw {
        status: 500,
        message: `Something have gone wrong cuate. ${error}`,
      };
    }
  }

  async deleteProductCart(userId, productId) {
    try {
      const queryDelete = {
        $pull: {
          cart: {
            productId,
          },
        },
      };
      const data = await User.findByIdAndUpdate(userId, queryDelete, {
        new: true,
      });
      return { status: 200, message: "Successfully created", dataUser: data };
    } catch (error) {
      throw {
        status: 500,
        message: `Something have gone wrong cuate. ${error}`,
      };
    }
  }
}

module.exports = ContainerCarts;
