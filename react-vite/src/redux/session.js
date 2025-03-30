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
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const thunkLogin = (credentials) => async dispatch => {
  try {
    const response = await csrfFetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });

    if(response.ok) {
      const data = await response.json();
      dispatch(setUser(data));
    } else {
      const errorMessages = await response.json();
      return errorMessages;
    }
  } catch (error) {
    // If it's a response error, try to parse it
    if (error.json) {
      try {
        const errorData = await error.json();
        return errorData;
      } catch (e) {
        console.error("Could not parse error response:", e);
      }
    }
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    // console.log("Signup Response Status:", response.status); // Debug log

    if(response.ok) {
      const data = await response.json();
      dispatch(setUser(data));
    } else {
      const errorMessages = await response.json();
      // Debug log
      // console.log("Signup Error Response:", {
      //   status: response.status,
      //   errorMessages
      // });
      return errorMessages;
    }
  } catch (error) {
    // Debug log
    // console.error("Signup Error Details:", {
    //   name: error.name,
    //   message: error.message,
    //   stack: error.stack
    // });
    
    // If it's a response error, try to parse it
    if (error.json) {
      try {
        const errorData = await error.json();
        // console.log("Error Response Data:", errorData); // Debug log
        return errorData;
      } catch (e) {
        console.error("Could not parse error response:", e);
      }
    }

    // return { 
    //   errors: {
    //     email: "Email already exists"  // Default error for duplicate email
    //   }
    // };
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
