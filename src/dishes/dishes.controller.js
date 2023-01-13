const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
//add handlers and middleware functions to create, read, update, and list dishes.
//Note that dishes cannot be deleted.


//==============================================================//
//middleware functions

//need for read and update
function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish does not exist: ${dishId}.`,
  });
}

//need for update
function matchingWithDishId(req, res, next) {
  const { dishId } = req.params;
  const { data: { id } = {} } = req.body;

  if (id && id !== dishId) {
    next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  }
  next();
}

//need for update and create
function validateProperties(req, res, next) {
  const { data } = req.body;
  const properties = ["name", "description", "price", "image_url"];

  properties.forEach((prop) => {
    if (!data[prop]) {
      next({
        status: 400,
        message: `Dish must include a ${prop}`,
      });
    }
    if (prop === "price") {
      if (!Number.isInteger(data["price"]) || data["price"] <= 0)
        next({
          status: 400,
          message: `Dish must have a price that is an integer greater than 0`,
        });
    }
  });
  return next();
}

//===========================================================//
//handler functions
function list(req, res) {
  res.json({ data: dishes });
}

function read(req, res, next) {
  res.json({ data: res.locals.dish });
}

function update(req, res, next) {
  const dish = res.locals.dish;
  const { data: { name, description, price, image_url } = {} } = req.body;

  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;

  res.json({ data: dish });
}

function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };

  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

module.exports = {
  list,
  read: [dishExists, read],
  update: [dishExists, validateProperties, matchingWithDishId, update],
  create: [validateProperties, create],
};
