import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { workspaceAPI } from "../services/api";

// Load workspaces from API
export const fetchWorkspaces = createAsyncThunk(
    'workspace/fetchWorkspaces',
    async (_, { rejectWithValue }) => {
        try {
            const workspaces = await workspaceAPI.getAll();
            return workspaces;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch workspaces');
        }
    }
);

const initialState = {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
    error: null,
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        clearWorkspaces: (state) => {
            state.workspaces = [];
            state.currentWorkspace = null;
        },
        setWorkspaces: (state, action) => {
            state.workspaces = action.payload;
        },
        setCurrentWorkspace: (state, action) => {
            const workspaceId = action.payload;
            localStorage.setItem("currentWorkspaceId", workspaceId);
            const workspace = state.workspaces.find((w) => w.id === workspaceId);
            if (workspace) {
                state.currentWorkspace = workspace;
            }
        },
        addWorkspace: (state, action) => {
            state.workspaces.push(action.payload);

            // set current workspace to the new workspace
            if (state.currentWorkspace?.id !== action.payload.id) {
                state.currentWorkspace = action.payload;
            }
        },
        updateWorkspace: (state, action) => {
            state.workspaces = state.workspaces.map((w) =>
                w.id === action.payload.id ? action.payload : w
            );

            // if current workspace is updated, set it to the updated workspace
            if (state.currentWorkspace?.id === action.payload.id) {
                state.currentWorkspace = action.payload;
            }
        },
        deleteWorkspace: (state, action) => {
            const workspaceId = action.payload;
            state.workspaces = state.workspaces.filter((w) => w.id !== workspaceId);
            
            // If the deleted workspace was the current one, set the first available workspace as current
            if (state.currentWorkspace?.id === workspaceId) {
                if (state.workspaces.length > 0) {
                    state.currentWorkspace = state.workspaces[0];
                    localStorage.setItem("currentWorkspaceId", state.workspaces[0].id);
                } else {
                    state.currentWorkspace = null;
                    localStorage.removeItem("currentWorkspaceId");
                }
            }
        },
        addProject: (state, action) => {
            // Ensure projects array exists
            if (!state.currentWorkspace.projects) {
                state.currentWorkspace.projects = [];
            }
            state.currentWorkspace.projects.push(action.payload);
            
            // find workspace by id and add project to it
            state.workspaces = state.workspaces.map((w) => {
                if (w.id === state.currentWorkspace.id) {
                    const projects = w.projects || [];
                    return { ...w, projects: [...projects, action.payload] };
                }
                return w;
            });
        },
        addTask: (state, action) => {
            if (!state.currentWorkspace || !state.currentWorkspace.projects) {
                return;
            }

            state.currentWorkspace.projects = state.currentWorkspace.projects.map((p) => {
                if (p.id === action.payload.projectId) {
                    const tasks = p.tasks || [];
                    return { ...p, tasks: [...tasks, action.payload] };
                }
                return p;
            });

            // find workspace and project by id and add task to it
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? {
                    ...w, projects: (w.projects || []).map((p) =>
                        p.id === action.payload.projectId ? { 
                            ...p, 
                            tasks: [...(p.tasks || []), action.payload] 
                        } : p
                    )
                } : w
            );
        },
        updateTask: (state, action) => {
            if (!state.currentWorkspace || !state.currentWorkspace.projects) {
                return;
            }

            state.currentWorkspace.projects = state.currentWorkspace.projects.map((p) => {
                if (p.id === action.payload.projectId) {
                    const tasks = p.tasks || [];
                    return {
                        ...p,
                        tasks: tasks.map((t) =>
                            t.id === action.payload.id ? action.payload : t
                        )
                    };
                }
                return p;
            });

            // find workspace and project by id and update task in it
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? {
                    ...w, projects: (w.projects || []).map((p) =>
                        p.id === action.payload.projectId ? {
                            ...p, tasks: (p.tasks || []).map((t) =>
                                t.id === action.payload.id ? action.payload : t
                            )
                        } : p
                    )
                } : w
            );
        },
        deleteTask: (state, action) => {
            if (!state.currentWorkspace || !state.currentWorkspace.projects) {
                return;
            }

            // Handle different payload formats:
            // - Array of task IDs: [id1, id2, ...]
            // - Object with id and projectId: { id, projectId }
            // - Single task ID: id
            let taskIds;
            let projectId = null;
            
            if (Array.isArray(action.payload)) {
                taskIds = action.payload;
            } else if (action.payload && typeof action.payload === 'object' && action.payload.id) {
                taskIds = [action.payload.id];
                projectId = action.payload.projectId;
            } else {
                taskIds = [action.payload];
            }

            // Filter tasks from all projects (or specific project if projectId is provided)
            state.currentWorkspace.projects = state.currentWorkspace.projects.map((p) => {
                if (projectId && p.id !== projectId) {
                    return p;
                }
                const tasks = p.tasks || [];
                return {
                    ...p,
                    tasks: tasks.filter((t) => !taskIds.includes(t.id))
                };
            });

            // Update workspaces state
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? {
                    ...w, projects: (w.projects || []).map((p) => {
                        if (projectId && p.id !== projectId) {
                            return p;
                        }
                        return {
                            ...p, tasks: (p.tasks || []).filter((t) => !taskIds.includes(t.id))
                        };
                    })
                } : w
            );
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkspaces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkspaces.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = action.payload;
                // Set first workspace as current if none selected
                if (!state.currentWorkspace && action.payload.length > 0) {
                    const storedId = localStorage.getItem("currentWorkspaceId");
                    const workspace = storedId 
                        ? action.payload.find(w => w.id === storedId)
                        : action.payload[0];
                    if (workspace) {
                        state.currentWorkspace = workspace;
                        localStorage.setItem("currentWorkspaceId", workspace.id);
                    }
                }
            })
            .addCase(fetchWorkspaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearWorkspaces, setWorkspaces, setCurrentWorkspace, addWorkspace, updateWorkspace, deleteWorkspace, addProject, addTask, updateTask, deleteTask } = workspaceSlice.actions;
export default workspaceSlice.reducer;