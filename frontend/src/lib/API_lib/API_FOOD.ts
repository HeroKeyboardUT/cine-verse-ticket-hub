import API from "./API";

class API_FOOD {
  // GET APIs
  GET_ALL_FOODS = `${API.SOURCE}/api/foods`;
  GET_FOOD_BY_ID = `${API.SOURCE}/api/foods/:id`;
  GET_FOOD_BY_NAME = `${API.SOURCE}/api/foods/name/:name`;

  // POST APIs
  CREATE_FOOD = `${API.SOURCE}/api/foods`;

  // PUT APIs
  UPDATE_FOOD = `${API.SOURCE}/api/foods/:id`;

  // DELETE APIs
  DELETE_FOOD = `${API.SOURCE}/api/foods/:id`;
}

export default new API_FOOD();
