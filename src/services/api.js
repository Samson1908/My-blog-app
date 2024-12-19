import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const fetchBlogs = async () => {
  const response = await axios.get(`${BASE_URL}/posts`);
  return response.data;
};
