import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../services/api";

// Check if user exists in localStorage on initial state
const getInitialUser = () => {
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            return userData;
        }
    } catch (error) {
        console.error("Error loading user from storage:", error);
        localStorage.removeItem("user");
    }
    return null;
};

// Get initial user data once
const initialUserData = getInitialUser();

const initialState = {
    user: initialUserData?.user || null,
    token: initialUserData?.token || null,
    isAuthenticated: !!initialUserData,
    loading: false,
    error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await authAPI.login(email, password);
            // Store both user and token
            const dataToStore = {
                user: response.user,
                token: response.token,
            };
            localStorage.setItem("user", JSON.stringify(dataToStore));
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const response = await authAPI.register(name, email, password);
            const dataToStore = {
                user: response.user,
                token: response.token,
            };
            localStorage.setItem("user", JSON.stringify(dataToStore));
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Registration failed');
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
            localStorage.removeItem("currentWorkspaceId");
        },
        loadUserFromStorage: (state) => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    state.user = userData.user;
                    state.token = userData.token;
                    state.isAuthenticated = true;
                } catch (error) {
                    console.error("Error loading user from storage:", error);
                    localStorage.removeItem("user");
                }
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
                // Workspaces will be loaded by Layout component
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            });
    },
});

export const { logout, loadUserFromStorage, clearError } = authSlice.actions;
export default authSlice.reducer;
