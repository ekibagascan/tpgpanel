import axios from "axios";

const API = axios.create({ baseURL: "https://topupgamesku.herokuapp.com/" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }

  return req;
});

export const fetchAllSlides = () => API.get(`/api/slides`);

export const fetchAllCategories = () => API.get(`/api/categories`);
export const fetchCategory = (name) =>
  API.get(`/api/categories/category/${name}`);

export const fetchProducts = (name) => API.get(`/api/products/${name}`);
export const fetchProduct = (id) => API.get(`/api/products/product/${id}`);

export const createOrder = (order) => API.post(`/api/orders`, order);
export const fetchAllOrders = () => API.get(`/api/orders`);
export const fetchOrder = (id) => API.get(`/api/orders/order/${id}`);
export const updateOrder = (id, updatedOrder) =>
  API.patch(`/api/orders/order/${id}`, updatedOrder);
export const deleteOrder = (id) => API.delete(`/api/orders/order/${id}`);

export const signIn = (formData) => API.post("/users/user/signin", formData);
export const signUp = (formData) => API.post("/users/user/signup", formData);
