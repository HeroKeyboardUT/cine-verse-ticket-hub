import API from "./API";

class API_REPORT {
  GET_STATISTICS = `${API.SOURCE}/api/reports/statistics`;
  GET_MONTHLY_REVENUE = `${API.SOURCE}/api/reports/revenue/monthly`;
  GET_DAILY_REVENUE = `${API.SOURCE}/api/reports/revenue/daily`;
  GET_MOVIE_REVENUE = `${API.SOURCE}/api/reports/revenue/movie`;
  GET_TOP_CUSTOMERS = `${API.SOURCE}/api/reports/topCustomers`;

  //   GET_LOCATION_REVENUE = `${API.SOURCE}/api/reports/revenue/location`;
}

export default new API_REPORT();
