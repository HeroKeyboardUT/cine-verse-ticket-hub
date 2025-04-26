import API from "./API";

class API_ORDER {
  // GET APIs
  GET_ALL_ORDERS = `${API.SOURCE}/api/orders`;
  GET_ORDER_BY_ID = `${API.SOURCE}/api/orders/:id`;
  GET_USER_ORDERS = `${API.SOURCE}/api/customers/:id/orders`;
  GET_TICKET_ORDER_BY_ID = `${API.SOURCE}/api/orders/:id/tickets`;
  GET_FOOD_ORDER_BY_ID = `${API.SOURCE}/api/orders/:id/food`;
  // POST APIs
  CREATE_ORDER = `${API.SOURCE}/api/orders`;
  // CREATE_TICKET_ORDER = `${API.SOURCE}/api/orders/ticket`;
  UPDATE_ORDER_STATUS = `${API.SOURCE}/api/orders/:id/status`;
}

export default new API_ORDER();
