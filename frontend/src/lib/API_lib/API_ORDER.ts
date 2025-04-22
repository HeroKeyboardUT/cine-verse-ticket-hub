
// API RELATED TO ORDERS
import API from "./API";

class API_ORDER {
  // GET API
  GET_ORDERS = API.SOURCE + "/api/orders";
  GET_ORDER_BY_ID = API.SOURCE + "/api/orders/:id";
  GET_ORDER_BY_CUSTOMER = API.SOURCE + "/api/customers/:id/orders";

  // CREATE API
  CREATE_ORDER = API.SOURCE + "/api/orders";

  // UPDATE API
  UPDATE_ORDER = API.SOURCE + "/api/orders/:id";

  // DELETE API
  DELETE_ORDER = API.SOURCE + "/api/orders/:id";
}

export default new API_ORDER();
