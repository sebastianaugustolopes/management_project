import { useState } from "react";
import { XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace, fetchWorkspaces } from "../features/workspaceSlice";
import { workspaceAPI } from "../services/api";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const CreateWorkspaceDialog = ({ isDialogOpen, setIsDialogOpen }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error("Workspace name is required");
            return;
        }

        if (!user) {
            toast.error("You must be logged in to create a workspace");
            return;
        }

        setIsSubmitting(true);

        try {
            // Call API to create workspace
            const newWorkspace = await workspaceAPI.create({
                name: formData.name.trim(),
                description: formData.description || null,
                imageUrl: assets.workspace_img_default,
            });

            toast.success(`Workspace "${formData.name}" created successfully!`);

            // Reload workspaces from API
            await dispatch(fetchWorkspaces()).unwrap();
            
            // Set the new workspace as current
            dispatch(setCurrentWorkspace(newWorkspace.id));

            // Reset form and close dialog
            setFormData({ name: "", description: "" });
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error creating workspace:", error);
            toast.error(error.message || "Failed to create workspace. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isDialogOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg text-zinc-900 dark:text-zinc-200 relative">
                <button 
                    className="absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200" 
                    onClick={() => setIsDialogOpen(false)}
                >
                    <XIcon className="size-5" />
                </button>

                <h2 className="text-xl font-medium mb-4">Create New Workspace</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Workspace Name */}
                    <div>
                        <label className="block text-sm mb-1 font-medium">Workspace Name</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                            placeholder="Enter workspace name" 
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            required 
                            maxLength={50}
                        />
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                            This will be the name of your workspace
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm mb-1 font-medium">Description (Optional)</label>
                        <textarea 
                            value={formData.description} 
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                            placeholder="Describe your workspace" 
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            maxLength={200}
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={() => {
                                setIsDialogOpen(false);
                                setFormData({ name: "", description: "" });
                            }} 
                            className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting || !formData.name.trim()} 
                            className="px-4 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:text-zinc-200 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? "Creating..." : "Create Workspace"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkspaceDialog;
