# GrubDash-app-thinkful-module-36

GrubDash is an online for ordering and delivery app.

In this Thinkful project, I set up a RESTful API, wrote custom validation functions, created route handlers, and built specific API endpoints. The front-end part is not included in this project.

#Technology
- Build with Node.js and Express server framework.

#API Documentation

All requests return JSON response. All post requests require application/json body, and return JSON response.

1. Endpoints for dishes:

  a. Get Dishes: GET to /dishes
  
    - Requests all existing dish data.
    - Successful GET requests will return an array of JSON objects representing the saved dishes. The response from the server  should look like the following:
    
  b. Create New Dish: POST to /dishes

    - POST request will be sent with a single JSON object 
    - Successful POST requests will return the newly created dish as a JSON object. The response from the server
   
  c. Get Specific Dish: GET to /dishes/:dishId

    - Requests a specific dish by :dishId
    - Successful GET requests will return a JSON object. 
    
  d. Update a Dish: PUT to /dishes/:dishId

    - PUT request will be sent with a single JSON object
    - Note: The id property isn't required in the body of the request, but if it is present, it must match :dishId from the route.
    
    
2. Endpoints for orders:

    a. Get Orders: GET to /orders

      - Requests a list of all existing order data.
      - Successful GET requests will return an array of JSON objects representing the saved orders. 
      
    b. Create New Order: POST to /orders

      - POST request will be sent with a single JSON object 
      - Note: Each dish in the Order's dishes property is a complete copy of the dish, rather than a reference to the dish by ID. This is so the order does not change retroactively if the dish data is updated some time after the order is created.
      - Successful POST requests will return the newly created order as a JSON object. 
      
      
    c. Get Order by ID: GET to /orders/:orderId

      - Requests a specific order by :orderId
      - Successful GET requests will return a JSON object. 
      
    d. Update Order: PUT to /orders/:orderId

      - PUT request will be sent with a single JSON object
      - Note: The id property isn't required in the body of the request, but if it is present, it must match :orderId from the route.
      
    e. Delete Order: DELETE to /orders/:orderId

      - DELETE request will be sent without a request body.
      - Note: If the given :orderId does not match an existing order, the server should respond with 404.
      - A successful DELETE request will result in a response status code of 204 and no response body.
