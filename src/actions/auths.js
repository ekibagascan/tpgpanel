import { AUTH } from "../constants/actionTypes.js";
import * as api from "../api/index.js";

export const signin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    console.log(data);
    dispatch({ type: AUTH, data });

    navigate("/dashboard/app", { replace: true });
  } catch (error) {
    console.log(error.message);
  }
};

export const signup = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });
    navigate("/dashboard/app", { replace: true });
  } catch (error) {
    console.log(error);
  }
};
