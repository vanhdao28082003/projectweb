import createApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "/api/books") {
    this.api = createApiClient(baseUrl);
  }
  async getAll() {
    return (await this.api.get("/")).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async borrowBook(bookId) {
    try {
      const response = await this.apiClient.get('/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
export default new BookService();