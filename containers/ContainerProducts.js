require("../db/mongo_connection");
const Product = require("../models/product");
const User = require("../models/user");
const orders = require("../constants/orders");
class ContainerProducts {
  async getAll() {
    try {
      const data = await Product.find({});
      return {
        status: 200,
        message: "Successfull request",
        data,
      };
    } catch (error) {
      throw {
        status: 500,
        message: `Something have gone wrong. Unsuccessful action. ${error.message}`,
      };
    }
  }

  async getById(id) {
    try {
      const data = await Product.findById(id).exec();
      return {
        status: 200,
        message: "Successfull request",
        data,
      };
    } catch (error) {
      throw {
        status: 500,
        message: `Something have gone wrong. Unsuccessful action. ${error.message}`,
      };
    }
  }

  async getSeveralIds(ids) {
    try {
      const data = await Product.find({ _id: { $in: ids } });
      return {
        status: 200,
        message: "Successfull request",
        data,
      };
    } catch (error) {
      throw {
        status: 500,
        message: `Something have gone wrong. Unsuccessful action. ${error.message}`,
      };
    }
  }

  async getByCategory(category, orderBy, brandType) {
    try {
      const data = await Product.find({
        article: category,
        "brand.name": { $in: brandType },
      }).sort(orderBy ? { price: orders[orderBy] } : { $natural: 1 });
      return {
        status: 200,
        message: "Successfull request",
        data,
      };
    } catch (error) {
      throw {
        status: 500,
        message: `Something have gone wrong. Unsuccessful action. ${error.message}`,
      };
    }
  }

  async getByDiscount(categoryDiscount) {
    try {
      const data = await Product.find({ [categoryDiscount]: { $gt: 0 } });
      return {
        status: 200,
        message: "Successfull request",
        data,
      };
    } catch (error) {
      throw {
        status: 500,
        message: `Something have gone wrong. Unsuccessful action. ${error.message}`,
      };
    }
  }

  async generalSearch(regexList, limit) {
    try {
      const data = await Product.find({ title: { $all: regexList } }).limit(
        Number(limit) || 0
      );
      return {
        status: 200,
        message: "Successfull request",
        data,
      };
    } catch (error) {
      throw {
        status: 500,
        message: `Something have gone wrong. Unsuccessful action. ${error.message}`,
      };
    }
  }

  async getComparison(ids) {
    try {
      if (ids.length < 2 || ids.length > 4)
        throw {
          status: 400,
          message: "Please, send an array with a number of id between 2 and 4",
        };
      const data = await Product.find({ _id: { $in: ids } });
      const sameCategory = data
        .slice(1)
        .every((item) => item.article === data[0].article);
      if (!sameCategory)
        throw {
          status: 400,
          message: "Please, send products of the same category",
        };

      let fields = data
        .reduce((ac, item) => [...ac, ...item.specifications], [])
        .reduce((ac, item) => {
          if (item.title in ac)
            return {
              ...ac,
              [item.title]: [...ac[item.title], item.especifications2],
            };
          return { ...ac, [item.title]: [item.especifications2] };
        }, {});

      let comparison = data.map((item) => ({
        id: item.id,
        image: item.images[0],
        title: item.title,
        price: item.price,
      }));

      fields = {
        products: comparison,
        ...fields,
      };
      return {
        status: 200,
        message: "Successfull request",
        data: fields,
      };
    } catch (error) {
      throw {
        status: 500,
        message: `Something have gone wrong. Unsuccessful action. ${error.message}`,
      };
    }
  }

  async getVisitedProducts(ids) {
    try {
      const data = await Product.find({ _id: { $in: ids } });
      return data;
    } catch (error) {
      throw { message: "Ha ocurrido un error" };
    }
  }
  saveSessionProducts(visits, id) {
    if (visits.findIndex((item) => item === id) === -1) return [...visits, id];
    return visits;
  }

  async getFavorites(userId) {
    try {
      const data = await User.findById(userId);
      return { favorites: data.favorites };
    } catch (error) {
      throw { message: "Ha ocurrido un error" };
    }
  }

  async setFavorites(userId, productId) {
    try {
      const queryAddUpdate = {
        $push: {
          favorites: productId,
        },
      };
      const queryDeleteUpdate = {
        $pull: {
          favorites: productId,
        },
      };
      const currentFavorites = await User.findById(userId);
      const existsFav = currentFavorites.favorites.find(
        (item) => item === productId
      );
      let update;
      existsFav
        ? (update = await User.findByIdAndUpdate(userId, queryDeleteUpdate, {
            new: true,
          }))
        : (update = await User.findByIdAndUpdate(userId, queryAddUpdate, {
            new: true,
          }));

      return {
        status: 200,
        message: "Successfull request",
        data: update,
      };
    } catch (error) {
      throw {
        status: 500,
        message: `Something have gone wrong. Unsuccessful action. ${error.message}`,
      };
    }
  }
}

module.exports = ContainerProducts;
