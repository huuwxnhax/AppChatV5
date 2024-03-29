import * as AuthApi from "../api/AuthRequests";
export const logIn = (formData, navigate) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.logIn(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
    navigate("/", { replace: true });
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
  }
};

export const signUp = (formData, navigate) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.signUp(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
    navigate("/", { replace: true });
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
  }
};

export const sendOtp = (username) => async (dispatch) => {
  dispatch({ type: "SEND_START" });
  try {
    console.log("data", username);
    const { data } = await AuthApi.sendOtp(username);
    dispatch({ type: "SEND_SUCCESS", data: data });
    console.log("data", data);

  } catch (error) {
    console.log(error);
    dispatch({ type: "SEND_FAIL" });
  }
}

export const logout = ()=> async(dispatch)=> {
  dispatch({type: "LOG_OUT"})
}
