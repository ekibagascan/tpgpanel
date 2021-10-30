import { AUTH } from "../constants/actionTypes.js";
import * as api from "../api/index.js";

export const signin = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    console.log(data);
    dispatch({ type: AUTH, data });

    router.push("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    router.push("/dashboard");
  } catch (error) {
    console.log(error);
  }
};
