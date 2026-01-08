import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace, fetchWorkspaces, setWorkspaces, deleteWorkspace } from "../features/workspaceSlice";
import { workspaceAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import CreateWorkspaceDialog from "./CreateWorkspaceDialog";
import toast from "react-hot-toast";

function WorkspaceDropdown() {

    const { workspaces } = useSelector((state) => state.workspace);
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const [isOpen, setIsOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const dropdownRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSelectWorkspace = async (workspaceId) => {
        try {
            // Fetch full workspace details including projects and members
            const fullWorkspace = await workspaceAPI.getById(workspaceId);
            
            // Update workspaces list with the full workspace
            const updatedWorkspaces = workspaces.map(w => 
                w.id === workspaceId ? fullWorkspace : w
            );
            dispatch(setWorkspaces(updatedWorkspaces));
            dispatch(setCurrentWorkspace(workspaceId));
            setIsOpen(false);
            navigate('/');
        } catch (error) {
            console.error("Error loading workspace:", error);
            // Fallback to simple selection
            dispatch(setCurrentWorkspace(workspaceId));
            setIsOpen(false);
            navigate('/');
        }
    }

    const handleDeleteWorkspace = async (e, workspaceId, workspaceName) => {
        e.stopPropagation(); // Prevent selecting the workspace when clicking delete
        
        const confirmMessage = `Are you sure you want to delete "${workspaceName}"? This action cannot be undone and will delete all projects and tasks in this workspace.`;
        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            toast.loading("Deleting workspace...");
            
            // Delete workspace via API
            await workspaceAPI.delete(workspaceId);
            
            // Update Redux state
            dispatch(deleteWorkspace(workspaceId));
            
            // Reload workspaces to ensure consistency
            await dispatch(fetchWorkspaces()).unwrap();
            
            setIsOpen(false);
            toast.dismissAll();
            toast.success("Workspace deleted successfully");
            
            // Navigate to dashboard if we deleted the current workspace
            navigate('/');
        } catch (error) {
            toast.dismissAll();
            toast.error(error?.message || "Failed to delete workspace");
            console.error("Error deleting workspace:", error);
        }
    }

    // Load workspaces on mount
    useEffect(() => {
        dispatch(fetchWorkspaces());
    }, [dispatch]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative m-4" ref={dropdownRef}>
            <button onClick={() => setIsOpen(prev => !prev)} className="w-full flex items-center justify-between p-3 h-auto text-left rounded hover:bg-gray-100 dark:hover:bg-zinc-800" >
                <div className="flex items-center gap-3">
                    {(currentWorkspace?.imageUrl || currentWorkspace?.image_url) && (
                        <img src={currentWorkspace.imageUrl || currentWorkspace.image_url} alt={currentWorkspace.name} className="w-8 h-8 rounded shadow" />
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                            {currentWorkspace?.name || "Select Workspace"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                            {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-zinc-400 flex-shrink-0" />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded shadow-lg top-full left-0">
                    <div className="p-2">
                        <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2 px-2">
                            Workspaces
                        </p>
                        {workspaces.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-zinc-400 px-2 py-4 text-center">
                                No workspaces yet. Create one to get started!
                            </p>
                        ) : (
                            workspaces.map((ws) => (
                                <div key={ws.id} onClick={() => onSelectWorkspace(ws.id)} className="flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-zinc-800 group" >
                                    <img src={ws.imageUrl || ws.image_url || "/default-workspace.png"} alt={ws.name} className="w-6 h-6 rounded" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                            {ws.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                                            {ws.members?.length || 0} member{ws.members?.length !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                    {currentWorkspace?.id === ws.id && (
                                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    )}
                                        <button
                                            onClick={(e) => handleDeleteWorkspace(e, ws.id, ws.name)}
                                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-opacity"
                                            title="Delete workspace"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <hr className="border-gray-200 dark:border-zinc-700" />

                    <div 
                        className="p-2 cursor-pointer rounded group hover:bg-gray-100 dark:hover:bg-zinc-800" 
                        onClick={() => {
                            setIsCreateDialogOpen(true);
                            setIsOpen(false);
                        }}
                    >
                        <p className="flex items-center text-xs gap-2 my-1 w-full text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300">
                            <Plus className="w-4 h-4" /> Create Workspace
                        </p>
                    </div>
                </div>
            )}

            <CreateWorkspaceDialog 
                isDialogOpen={isCreateDialogOpen} 
                setIsDialogOpen={setIsCreateDialogOpen} 
            />
        </div>
    );
}

export default WorkspaceDropdown;
