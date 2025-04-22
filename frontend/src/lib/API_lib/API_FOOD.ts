
// API RELATED TO FOOD AND DRINKS
import API from "./API";

class API_FOOD {
  // GET API
  GET_FOOD_ITEMS = API.SOURCE + "/api/food";
  GET_FOOD_BY_ID = API.SOURCE + "/api/food/:id";
  
  // CREATE API
  CREATE_FOOD = API.SOURCE + "/api/food";
  
  // UPDATE API
  UPDATE_FOOD = API.SOURCE + "/api/food/:id";
  
  // DELETE API
  DELETE_FOOD = API.SOURCE + "/api/food/:id";
}

export default new API_FOOD();
