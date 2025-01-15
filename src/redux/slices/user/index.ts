import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './types';

// Define the initial state using the User type
const initialState: User = {
  id: 0,
  employeeName: '',
  joiningDate: null,
  address: '',
  emailID: '',
  mobileNo: '',
  birthDate: null,
  churchName: '',
  photo: '',
  role: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return { ...state, ...action.payload };
    },
    clearUser(state) {
      return initialState;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
