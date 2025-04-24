import API from "./API";

class API_ORDER {
  // GET APIs
  GET_ALL_ORDERS = `${API.SOURCE}/api/orders`;
  GET_ORDER_BY_ID = `${API.SOURCE}/api/orders`;
  // POST APIs
  CREATE_ORDER = `${API.SOURCE}/api/orders`;
  // CREATE_TICKET_ORDER = `${API.SOURCE}/api/orders/ticket`;
}

export default new API_ORDER();
