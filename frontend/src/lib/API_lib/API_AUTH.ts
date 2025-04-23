import API from "./API";

class API_AUTH {
  // GET API
  REGISTER = API.SOURCE + "/api/auth/register";
  LOGIN = API.SOURCE + "/api/auth/login";
  PASSWORD_RESET = API.SOURCE + "/api/auth/password-reset";
  ADMIN_LOGIN = API.SOURCE + "/api/auth/adminlogin";
}

export default new API_AUTH();