import {
  CREATE_ORDER,
  UPDATE_ORDER,
  DELETE_ORDER,
  FETCH_ORDER,
  FETCH_ALL_ORDERS,
} from "../constants/actionTypes";

const initialState = {
  isLoading: true,
  orders: [],
};

const orders = (state = initialState, action) => {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, isLoading: true };
    case "END_LOADING":
      return { ...state, isLoading: false };
    case CREATE_ORDER:
      return { ...state, orders: [...state.orders, action?.payload] };
    case UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
      };
    case DELETE_ORDER:
      return {
        ...state,
        orders: state.orders.filter((order) => order._id !== action.payload),
      };
    case FETCH_ALL_ORDERS:
      return { ...state, orders: action.payload.data };
    case FETCH_ORDER:
      return { ...state, order: action.payload.order };
    default:
      return state;
  }
};

export default orders;
