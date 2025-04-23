import API from "./API";

class API_VOUCHER {
  // GET APIs
  GET_VOUCHER_BY_CODE = `${API.SOURCE}/api/vouchers`;
  GET_ALL_VOUCHERS = `${API.SOURCE}/api/vouchers`;

  // POST APIs
  APPLY_VOUCHER = `${API.SOURCE}/api/vouchers/apply`;
}

export default new API_VOUCHER();
