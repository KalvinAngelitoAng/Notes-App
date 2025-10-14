import CONFIG from '../config';

const { BASE_URL, USER_TOKEN_KEY } = CONFIG;

const api = {
  async register({ name, email, password }) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  },

  async login({ email, password }) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const responseJson = await response.json();
    if (!responseJson.error) {
      localStorage.setItem(USER_TOKEN_KEY, responseJson.loginResult.token);
    }
    return responseJson;
  },

  logout() {
    localStorage.removeItem(USER_TOKEN_KEY);
  },

  async getAllStories() {
    const response = await fetch(`${BASE_URL}/stories`, {
      headers: { Authorization: `Bearer ${localStorage.getItem(USER_TOKEN_KEY)}` },
    });
    return response.json();
  },

  async getStoryDetail(id) {
    const response = await fetch(`${BASE_URL}/stories/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem(USER_TOKEN_KEY)}` },
    });
    return response.json();
  },

  async addNewStory(formData) {
    const response = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem(USER_TOKEN_KEY)}` },
      body: formData,
    });
    return response.json();
  },

  async addNewStoryGuest(formData) {
    const response = await fetch(`${BASE_URL}/stories/guest`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },
};

export default api;