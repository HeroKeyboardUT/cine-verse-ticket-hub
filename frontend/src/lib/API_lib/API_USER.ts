import API from "./API";

class API_USER {
  // GET APIs
  GET_ALL_USERS = `${API.SOURCE}/api/customers`;
  GET_USER_BY_ID = `${API.SOURCE}/api/customers/:id`;

  // POST APIs
  CREATE_USER = `${API.SOURCE}/api/customers`;
  // PUT APIs
  UPDATE_USER = `${API.SOURCE}/api/customers/:id`;

  // DELETE APIs
  DELETE_USER = `${API.SOURCE}/api/customers/:id`;
}
export default new API_USER();
