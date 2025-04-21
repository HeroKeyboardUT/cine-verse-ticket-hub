// API RELATED TO MOVIES
// This file contains the API endpoints related to movies
const SOURCE = "http://localhost:5000";

class API_MOVIES {
  // GET API
  GET_MOVIES = SOURCE + "/api/movies";

  GET_MOVIE_BY_ID = SOURCE + "/api/movies/:id";

  GET_MOVIE_RATINGS = SOURCE + "/api/movies/:id/ratings";

  GET_MOVIE_ON_SHOWING = SOURCE + "/api/movies/now-showing";

  // CREATE API
  CREATE_MOVIE = SOURCE + "/api/movies/create";

  // UPDATE API
  UPDATE_MOVIE = SOURCE + "/api/movies/update/:id";

  // DELETE API
  DELETE_MOVIE = SOURCE + "/api/movies/delete/:id";
}

export default new API_MOVIES();
