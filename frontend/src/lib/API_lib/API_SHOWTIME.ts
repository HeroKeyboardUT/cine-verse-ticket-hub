// API_SHOWTIME.ts

const SOURCE = "http://localhost:5000";

class API_SHOWTIME {
  // GET APIs
  GET_ALL_SHOWTIMES = `${SOURCE}/api/showtimes`;
  GET_SHOWTIME_BY_ID = `${SOURCE}/api/showtimes/:id`;

  // CREATE API
  CREATE_SHOWTIME = `${SOURCE}/api/showtimes`;

  // UPDATE API
  UPDATE_SHOWTIME = `${SOURCE}/api/showtimes/:id`;

  // DELETE API
  DELETE_SHOWTIME = `${SOURCE}/api/showtimes/:id`;
}

export default new API_SHOWTIME();
