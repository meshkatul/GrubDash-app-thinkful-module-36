const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
//add handlers and middleware functions to create, read, update, delete, and list orders

//===========================================================//
//middleware functions

//need for read and delete
function orderExist(req, res, next) {
  const { orderId } = req.params;
  const orderFound = orders.find((order) => order.id === orderId);
  if (orderFound) {
    res.locals.order = orderFound;
    return next();
  }
  next({
    status: 404,
    message: `Order does not exist: ${orderId}.`,
  });
}

//need for update
function matchingWithOrderId(req, res, next) {
  const { orderId } = req.params; //route id
  const { data: { id } = {} } = req.body;

  if (!id || id === "") {
    return next();
  }

  if (id !== orderId) {
    next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
    });
  } else {
    return next();
  }
}

//need for update and create
function validateProperties(req, res, next) {
  const { data } = req.body;
  const properties = ["deliverTo", "mobileNumber"];
  properties.forEach((prop) => {
    if (!data[prop]) {
      next({
        status: 400,
        message: `Order must include a ${prop}`,
      });
    }
  });
  next();
}

//need for update
function validateStatus(req, res, next) {
  const { data: { status } = {} } = req.body;

  if (!status || status === "" || status === "invalid") {
    next({
      status: 400,
      message:
        "Order must have a status of pending, preparing, out-for-delivery, delivered",
    });
  } else if (status === "delivered") {
    next({
      status: 400,
      message: "A delivered order cannot be changed",
    });
  } else {
    return next();
  }
}

//need for create and update
function validateDishes(req, res, next) {
  const { data: { dishes } = {} } = req.body;

  if (!dishes) {
    next({
      status: 400,
      message: `Order must include a dish`,
    });
  } else if (dishes.length === 0 || !Array.isArray(dishes)) {
    next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }

  dishes.forEach((dish, index) => {
    const quantity = dish["quantity"];
    if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
      next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an 
                  integer greater than 0`,
      });
    }
  });

  return next();
}

//need for delete
function orderIsPending(req, res, next) {
  const { status } = res.locals.order;
  if (status !== "pending") {
    next({
      status: 400,
      message: `An order cannot be deleted unless it is pending.`,
    });
  }
  next();
}

//====================================================================================//
//handler functions

function list(req, res) {
  res.json({ data: orders });
}

function read(req, res) {
  res.json({ data: res.locals.order });
}

function destroy(req, res) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === Number(orderId));
  orders.splice(index, 1);
  res.sendStatus(204);
}

function update(req, res, next) {
  const order = res.locals.order;
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;

  res.json({ data: order });
}

function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

module.exports = {
  list,
  read: [orderExist, read],
  create: [validateDishes, validateProperties, create],
  update: [
    orderExist,
    validateDishes,
    validateProperties,
    matchingWithOrderId,
    validateStatus,
    update,
  ],
  delete: [orderExist, orderIsPending, destroy],
};
