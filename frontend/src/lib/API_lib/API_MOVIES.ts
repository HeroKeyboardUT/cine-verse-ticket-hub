// API RELATED TO MOVIES
// This file contains the API endpoints related to movies
import API from "./API";

class API_MOVIES {
  // GET API
  GET_MOVIES = API.SOURCE + "/api/movies";

  GET_MOVIE_BY_ID = API.SOURCE + "/api/movies/:id";

  GET_MOVIE_RATINGS = API.SOURCE + "/api/movies/:id/ratings";

  GET_MOVIE_ON_SHOWING = API.SOURCE + "/api/movies/now-showing";

  // CREATE API
  // Endpoint tạo phim phải đúng với backend
  CREATE_MOVIE = API.SOURCE + "/api/movies/create";

  // UPDATE API
  UPDATE_MOVIE = API.SOURCE + "/api/movies/update/:id";

  // DELETE API
  DELETE_MOVIE = API.SOURCE + "/api/movies/delete/:id";
}

export default new API_MOVIES();
