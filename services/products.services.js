const Factory = require("../dao/factory");
const getAll = async () => {
  try {
    const data = await Factory.models("product").getAll();
    return data;
  } catch (error) {
    throw error;
  }
};
const getById = async (id) => {
  try {
    const data = await Factory.models("product").getById(id);
    return data;
  } catch (error) {
    throw error;
  }
};
const getSeveralIds = async (q) => {
  try {
    if (!q || !Array.isArray(q) || q.some((x) => x.trim() === ""))
      throw { status: 400, message: "Bad request. Insert an array of ids" };
    const query = { _id: { $in: q } };
    const data = await Factory.models("product").getByQuery(query);
    return data;
  } catch (error) {
    throw error;
  }
};
const getByDiscount = async (categoryDiscount) => {
  try {
    if (categoryDiscount !== "saleoff" && categoryDiscount !== "highlighted")
      throw {
        status: 400,
        message: "Bad request. Insert valid discount type.",
      };
    const query = { [categoryDiscount]: { $gt: 0 } };
    const data = await Factory.models("product").getByQuery(query);
    return data;
  } catch (error) {
    throw error;
  }
};
const getByCategory = async (category, orderBy, brandType) => {
  try {
    const query = {
      article: category,
      "brand.name": { $in: brandType },
    };
    const data = await Factory.models("product").getByQuery(
      query,
      0,
      orderBy,
      "price"
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const generalSearch = async (q, limit) => {
  if (!q || !q.length || !q[0].length) {
    throw {
      status: 400,
      message: "Bad request. Please introduce a valid array query.",
    };
  }
  const regexList = q.map((item) => new RegExp(`${item}`, "i"));
  const query = { title: { $all: regexList } };
  try {
    const data = await Factory.models("product").getByQuery(query, limit);
    return data;
  } catch (error) {
    throw error;
  }
};
const getComparison = async (ids) => {
  try {
    if (ids.length < 2 || ids.length > 4)
      throw {
        status: 400,
        message: "Please, send an array with a number of id between 2 and 4",
      };

    const data = await Factory.models("product").getByQuery({
      _id: { $in: ids },
    });
    const sameCategory = data.data
      .slice(1)
      .every((item) => item.article === data.data[0].article);
    if (!sameCategory)
      throw {
        status: 400,
        message: "Please, send products of the same category",
      };

    let fields = data.data
      .reduce((ac, item) => [...ac, ...item.specifications], [])
      .reduce((ac, item) => {
        if (item.title in ac)
          return {
            ...ac,
            [item.title]: [...ac[item.title], item.especifications2],
          };
        return { ...ac, [item.title]: [item.especifications2] };
      }, {});

    let comparison = data.data.map((item) => ({
      id: item.id,
      image: item.images[0],
      title: item.title,
      price: item.price,
    }));

    fields = {
      products: comparison,
      ...fields,
    };
    return { status: 200, message: "Successful request", data: fields };
  } catch (error) {
    throw error;
  }
};

const setFavorites = async (userId, productId) => {
  try {
    if (!userId || !productId)
      throw {
        status: 400,
        message: "Bad request. Insert an userId and a productId",
      };

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
    const currentFavorites = await Factory.models("user").getById(userId);

    const existsFav = currentFavorites.data.favorites.find(
      (item) => item === productId
    );

    let update;
    existsFav
      ? (update = await Factory.models("user").updateById(
          userId,
          queryDeleteUpdate
        ))
      : (update = await Factory.models("user").updateById(
          userId,
          queryAddUpdate
        ));
    return update;
  } catch (error) {
    throw error;
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
  setFavorites,
};
