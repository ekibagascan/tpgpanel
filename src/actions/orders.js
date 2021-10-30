import * as api from "../api";
import {
  CREATE_ORDER,
  UPDATE_ORDER,
  DELETE_ORDER,
  FETCH_ORDER,
  FETCH_ALL_ORDERS,
  START_LOADING,
  END_LOADING,
} from "../constants/actionTypes";

export const createOrder = (order, history) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.createOrder(order);

    dispatch({ type: CREATE_ORDER, payload: data });
    history.push(`/etalase/order/${data._id}`);
  } catch (error) {
    console.log(error);
  }
};

export const getOrders = () => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchAllOrders();

    dispatch({ type: FETCH_ALL_ORDERS, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const getOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const { data } = await api.fetchOrder(id);

    dispatch({ type: FETCH_ORDER, payload: { order: data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const updateOrder = (id, order) => async (dispatch) => {
  try {
    const { data } = await api.updateOrder(id, order);

    dispatch({ type: UPDATE_ORDER, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deleteOrder = (id) => async (dispatch) => {
  try {
    await await api.deleteOrder(id);

    dispatch({ type: DELETE_ORDER, payload: id });
  } catch (error) {
    console.log(error);
  }
};
