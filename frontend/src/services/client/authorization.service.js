import createApiClient from "./api.auth.service";

class AuthorizationServiceClient {

  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  async submitLogin(credentials) {
    try {
      const response = await this.api.post('/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  };


  async logOut(data) {
    return (await this.api.get("/logout", data)).data;
  }
}

export default new AuthorizationServiceClient();