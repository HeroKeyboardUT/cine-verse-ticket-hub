// API_SHOWTIME.ts

import API from "./API";

class API_SHOWTIME {
  // GET APIs
  GET_ALL_SHOWTIMES = `${API.SOURCE}/api/showtimes`;
  GET_SHOWTIME_BY_ID = `${API.SOURCE}/api/showtimes/:id`;

  // CREATE API
  CREATE_SHOWTIME = `${API.SOURCE}/api/showtimes`;

  // UPDATE API
  UPDATE_SHOWTIME = `${API.SOURCE}/api/showtimes/:id`;

  // DELETE API
  DELETE_SHOWTIME = `${API.SOURCE}/api/showtimes/:id`;
}

export default new API_SHOWTIME();
