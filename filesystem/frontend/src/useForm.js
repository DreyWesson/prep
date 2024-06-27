import { useState, useEffect } from 'react';
import { useGlobalState } from './StateProvider';
import { getItems, addItem, updateItem, deleteItem } from './apis';

const useForm = () => {
  const [{ items }, dispatch] = useGlobalState();
  const [formData, setFormData] = useState({ id: '', itemName: '' });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsData = await getItems();
        dispatch({ type: 'SET_ITEMS', items: itemsData.data });
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [dispatch]);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === 'id' && value !== '') {
      value = parseInt(value);
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, itemName } = formData;
    if (!id || !itemName) {
      alert('Please enter both ID and Item Name.');
      return;
    }
    try {
      const item = await addItem({ id, name: itemName });
      dispatch({ type: 'ADD_ITEM', item: item.data });
      setFormData({ id: '', itemName: '' });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { id, itemName } = formData;
    if (!id || !itemName) {
      alert('Please enter both ID and Item Name.');
      return;
    }
    try {
      const item = await updateItem({ id, name: itemName });
      dispatch({ type: 'UPDATE_ITEM', item });
      setFormData({ id: '', itemName: '' });
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const { id } = formData;
      if (!id) {
        alert('Please enter ID.');
        return;
      }
      await deleteItem(id);
      dispatch({ type: 'DELETE_ITEM', id });
      setFormData({ id: '', itemName: '' });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return {
    items,
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    handleUpdate,
    handleDelete,
  };
};

export default useForm;
