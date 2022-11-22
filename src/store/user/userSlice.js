import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

// const userToken = localStorage.getItem("userToken")
//   ? localStorage.getItem("userToken")
//   : null;

// const userId = localStorage.getItem("userId")
//   ? localStorage.getItem("userId")
//   : null;

const errors = {
  "auth/internal-error": "Error en la autenticación",
  "auth/user-not-found": "Usuario no registrado",
  "auth/wrong-password": "Contraseña incorrecta",
}

const { userToken = null, userId = null } =  localStorage.getItem("ea")
  ? JSON.parse(localStorage.getItem("ea"))
  : {}

const initialState = {
  loading: false,
  error: null,
  success: false,
  userId,
  userToken,
  isLoggedIn: false,
  userInfo: null,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async ({email, password}, /*{dispatch, getState}*/ thunkAPI ) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('ea', JSON.stringify({userToken: user.accessToken, userId: user.uid}));
      return {uid: user.uid, userToken: user.accessToken};
    } catch (err) {
      toast.error(errors[err.code] ?? "Ha ocurrido un error", { bodyClassName: "bg-rose-50", className: "!bg-rose-50 text-white"});
      return thunkAPI.rejectWithValue(JSON.stringify(err));
    }
  }
)

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { dispatch, rejectWithValue}) => {
    try {
      await signOut(auth);
      localStorage.removeItem("ea");
      // dispatch(resetUserInfo())
    } catch (err) {
      return rejectWithValue(JSON.stringify(err));
    }
  }
)

export const getUserInfo = createAsyncThunk(
  'user/getUserInfo',
  async (_, { getState, rejectWithValue }) => {
    const { user } = getState();
    try {
      const docRef = doc(db, "users", user.userId);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    } catch (err) {
      return rejectWithValue(JSON.stringify(err));
    }
  }
)

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action)  => {
      state.isLoggedIn = action.payload;
    },
    resetUserInfo: (state, action) => {
      state.userId = "";
      state.userToken = "";
      state.userInfo = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.loading = true;
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userId = action.payload.uid;
        state.userToken = action.payload.userToken;
        state.isLoggedIn = true;  //TODO: for  CASE-001
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })
      .addCase(logoutUser.pending, (state, action) => {
        state.loading = true;
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userId = null;
        state.userToken = null;
        state.userInfo = null;
        state.isLoggedIn = false; //TODO: for  CASE-001
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })
      .addCase(getUserInfo.pending, (state, action) => {
        state.loading = true;
        state.error = null
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userInfo = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })
  }
  // extraReducers: {
  //   [loginUser.pending]: (state) => {
  //     state.loading = true;
  //     state.error = null
  //   },
  //   // [registerUser.fulfilled]: (state, {payload}) => {
  //   [loginUser.fulfilled]: (state) => {
  //     state.loading = false;
  //     state.success = true;
  //     state.isLoggedIn = true;
  //   },
  //   [loginUser.rejected]: (state, {payload}) => {
  //     state.loading = false
  //     state.error = payload
  //   },
  // }
});

export const { setUserInfo, resetUserInfo } = userSlice.actions;

export const selectUserInfo = (state) => state.user.userInfo;

export default userSlice.reducer;