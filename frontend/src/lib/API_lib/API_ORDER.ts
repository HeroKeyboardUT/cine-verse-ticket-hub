import API from "./API";

class API_ORDER {
  // GET APIs
  GET_ALL_ORDERS = `${API.SOURCE}/api/orders`;
  GET_ORDER_BY_ID = `${API.SOURCE}/api/orders/:id`;
  GET_ORDER_BY_USER_ID = `${API.SOURCE}/api/orders/user/:userId`;

  // POST APIs
  CREATE_ORDER = `${API.SOURCE}/api/orders`;

  // PUT APIs
  UPDATE_ORDER = `${API.SOURCE}/api/orders/:id`;

  // DELETE APIs
  DELETE_ORDER = `${API.SOURCE}/api/orders/:id`;
}

export default new API_ORDER();
