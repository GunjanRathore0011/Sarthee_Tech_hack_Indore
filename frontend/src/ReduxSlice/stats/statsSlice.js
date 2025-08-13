import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch assigned cases
export const fetchAssignedCases = createAsyncThunk(
  "stats/fetchAssignedCases",
  async (investigatorId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/v1/investigator/allAssignedCases/${investigatorId}`
      );
      const data = await res.json();

      if (!data.success) {
        return rejectWithValue(data.message || "Failed to fetch assigned cases");
      }

      return {
        activeCases: data.activeCases.length,
        resolvedCases: data.resolvedCases.length,
        pendingActions: data.pendingActions,
        investigatingCases: data.investigatingCases
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const statsSlice = createSlice({
  name: "stats",
  initialState: {
    activeCases: 0,
    resolvedCases: 0,
    pendingActions: 0,
    investigatingCases: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignedCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedCases.fulfilled, (state, action) => {
        state.loading = false;
        state.activeCases = action.payload.activeCases;
        state.resolvedCases = action.payload.resolvedCases;
        state.pendingActions = action.payload.pendingActions;
        state.investigatingCases = action.payload.investigatingCases;
      })
      .addCase(fetchAssignedCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  }
});

export default statsSlice.reducer;
