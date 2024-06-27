import axiosInstance from "./axios";

const getHome = () => axiosInstance.get("/");

const getItems = async () => {
    try {
        const response = await axiosInstance.get("/items");
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

const getItem = async (id) => {
  try {
    const response = await axiosInstance.get(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    throw error;
  }
};
const addItem = async (item) => {
  try {
    const response = await axiosInstance.post("/items", item);
    return response.data;
  } catch (error) {
    console.error("Error adding item:", error);
    throw error;
  }
};  

const updateItem = async (updatedItem) => {
const {id} = updatedItem;
  try {
    const response = await axiosInstance.put(`/items/${id}`, updatedItem);
    return response.data;
  } catch (error) {
    console.error(`Error updating item ${id}:`, error);
    throw error;
  }
};

const deleteItem = async (id) => {
  try {
    const response = await axiosInstance.delete(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting item ${id}:`, error);
    throw error; // Re-throw error to handle it in components
  }
};

export { getHome, getItems, addItem, getItem, updateItem, deleteItem };
