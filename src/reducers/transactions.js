import {
  FETCH_TX,
  UPDATE_TX,
  DELETE_TX,
  FETCH_ALL_TX,
} from "../constants/actionTypes";

const initialState = {
  isTxLoading: true,
  txs: [],
};

const txs = (state = initialState, action) => {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, isTxLoading: true };
    case "END_LOADING":
      return { ...state, isTxLoading: false };
    case FETCH_TX:
      return { ...state, tx: action.payload.tx };
    case FETCH_ALL_TX:
      return { ...state, txs: action.payload.data };
    case UPDATE_TX:
      return {
        ...state,
        txs: state.txs.map((tx) =>
          tx._id === action.payload.id ? action.payload : tx
        ),
      };
    case DELETE_TX:
      return {
        ...state,
        txs: state.txs.filter((tx) => tx._id !== action.payload),
      };

    default:
      return state;
  }
};

export default txs;
