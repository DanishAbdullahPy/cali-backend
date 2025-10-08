import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { User } from '../../types/index';

interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  fetchLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
  fetchLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await api.get('/users');
  return response.data;
});

export const fetchUserById = createAsyncThunk('users/fetchUserById', async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
});

export const createUser = createAsyncThunk('users/createUser', async (userData: Omit<User, 'id'> | FormData) => {
  const config = userData instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await api.post('/users', userData, config);
  return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, userData }: { id: string; userData: Partial<User> | FormData }) => {
  const config = userData instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await api.put(`/users/${id}`, userData, config);
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: string) => {
  await api.delete(`/users/${id}`);
  return id;
});

export const fetchAndStoreUsers = createAsyncThunk('users/fetchAndStoreUsers', async () => {
  const response = await api.post('/users/fetch');
  // Refresh the users list after fetching
  await api.get('/users');
  return response.data;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload.data || action.payload;
        const index = state.users.findIndex((user: User) => user.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<User['id']>) => {
        state.users = state.users.filter((user: User) => user.id !== action.payload);
      })
      .addCase(fetchAndStoreUsers.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(fetchAndStoreUsers.fulfilled, (state, action) => {
        state.fetchLoading = false;
        const { created, updated } = action.payload;
        alert(`Users fetched successfully! Created: ${created}, Updated: ${updated}`);
      })
      .addCase(fetchAndStoreUsers.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;
