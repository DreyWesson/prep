export const initialState = {
  items: [],
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ITEMS":
      return {
        ...state,
        items: action.items,
      };
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.item],
      };
    case "UPDATE_ITEM":
      const { id, name } = action.item.data;
      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, name } : item
      );

      return {
        ...state,
        items: updatedItems,
      };
    case "DELETE_ITEM":
      console.log({action})
      const filteredItems = state.items.filter((item) => item.id !== action.item.id);
      console.log({ filteredItems });
      return {
        ...state,
        items: filteredItems,
      };
    default:
      return state;
  }
};
