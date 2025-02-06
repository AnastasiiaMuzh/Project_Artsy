import {csrfFetch} from "./csrf"

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

export const thunkAuthenticate = () => async (dispatch) => {
  // Do not use csrfFetch for this one, as the landing page does not require user to log in
  // This is related to the Layout.jsx that has thunkAuthenticate() in the useEffect
  // Therefore there are 2 options:
  // Option 1: 
  // use fetch for /api/auth & having the thunkAuthenticate in Layout.jsx
  // Option 2:
  // remove the thunkAuthenticate from Layout.jsx and use csrfFetch here
	const response = await csrfFetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const thunkLogin = (credentials) => async dispatch => {
  const response = await csrfFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  const response = await csrfFetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkLogout = () => async (dispatch) => {
  await csrfFetch("/api/auth/logout");
  dispatch(removeUser());
};

const initialState = { session: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, session: action.payload };
    case REMOVE_USER:
      return { ...state, session: null };
    default:
      return state;
  }
}

export default sessionReducer;
