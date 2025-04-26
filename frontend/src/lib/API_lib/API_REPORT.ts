import API from './API';

class API_REPORT {
    GET_STATISTICS = `${API.SOURCE}/report/statistics`;
    GET_MONTHLY_REVENUE = `${API.SOURCE}/report/revenue/monthly`;
    GET_DAILY_REVENUE = `${API.SOURCE}/report/revenue/daily`;
    GET_MOVIE_REVENUE = `${API.SOURCE}/report/revenue/movie`;
    GET_TOP_CUSTOMERS = `${API.SOURCE}/report/topCustomers`;
}

export default new API_REPORT();