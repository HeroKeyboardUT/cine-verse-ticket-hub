// API RELATED TO CINEMA
// This file contains the API endpoints related to cinema
import API from "./API";

class API_CINEMA {
  // GET API
  GET_CINEMAS = API.SOURCE + "/api/cinemas";
  GET_CINEMA_BY_ID = API.SOURCE + "/api/cinemas/:id";

  // CREATE API
  CREATE_CINEMA = API.SOURCE + "/api/cinemas";

  // UPDATE API
  UPDATE_CINEMA = API.SOURCE + "/api/cinemas/:id";

  // DELETE API
  DELETE_CINEMA = API.SOURCE + "/api/cinemas";
}

export default new API_CINEMA();
