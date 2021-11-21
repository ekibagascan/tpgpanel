import * as api from "../api";
import {
  FETCH_ALL_TX,
  FETCH_TX,
  UPDATE_TX,
  DELETE_TX,
  START_LOADING,
  END_LOADING,
} from "../constants/actionTypes";

export const getTx = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const { data } = await api.fetchTx(id);
    dispatch({ type: FETCH_TX, payload: { tx: data } });

    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const getAllTx = () => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchAllTx();

    dispatch({ type: FETCH_ALL_TX, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const updateTx = (id, tx) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.updateTx(id, tx);
    dispatch({ type: UPDATE_TX, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTx = (id) => async (dispatch) => {
  try {
    await api.deleteTx(id);
    dispatch({ type: DELETE_TX, payload: id });
  } catch (error) {
    console.log(error);
  }
};
