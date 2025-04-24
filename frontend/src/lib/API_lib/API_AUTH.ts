import API from "./API";

class API_AUTH {
  // GET API
  REGISTER = API.SOURCE + "/api/auth/register";
  LOGIN = API.SOURCE + "/api/auth/login";
  PASSWORD_RESET = API.SOURCE + "/api/auth/password-reset";
  ADMIN_LOGIN = API.SOURCE + "/api/auth/adminlogin";
  VERIFY_TOKEN = API.SOURCE + "/api/auth/verifyToken";
}

export default new API_AUTH();