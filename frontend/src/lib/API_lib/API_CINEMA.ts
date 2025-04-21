// API RELATED TO CINEMA
// This file contains the API endpoints related to cinema
const SOURCE = "http://localhost:5000";

class API_CINEMA {
  // GET API
  GET_CINEMAS = SOURCE + "/api/cinemas";
  GET_CINEMA_BY_ID = SOURCE + "/api/cinemas/:id";

  // CREATE API
  CREATE_CINEMA = SOURCE + "/api/cinemas";

  // UPDATE API
  UPDATE_CINEMA = SOURCE + "/api/cinemas/:id";

  // DELETE API
  DELETE_CINEMA = SOURCE + "/api/cinemas";
}

export default new API_CINEMA();
