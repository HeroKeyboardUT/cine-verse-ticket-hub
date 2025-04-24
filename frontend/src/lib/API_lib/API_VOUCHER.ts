import API from "./API";

class API_VOUCHER {
  // GET APIs
  GET_ALL_VOUCHERS = `${API.SOURCE}/api/voucher`;
  GET_VOUCHER_BY_CODE = `${API.SOURCE}/api/vouchers/code`;
  GET_VOUCHER_BY_ID = `${API.SOURCE}/api/vouchers`;
}

export default new API_VOUCHER();
