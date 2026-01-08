import { useState } from "react";
import { Mail, UserPlus, XIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { projectAPI } from "../services/api";
import { fetchWorkspaces } from "../features/workspaceSlice";
import toast from "react-hot-toast";

const AddProjectMember = ({ isDialogOpen, setIsDialogOpen }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const id = searchParams.get('id');

    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);

    const project = currentWorkspace?.projects?.find((p) => p.id === id);
    const projectMembersEmails = Array.isArray(project?.members) 
        ? project.members.map((member) => member?.user?.email || member?.email).filter(Boolean) 
        : [];

    const [email, setEmail] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
            toast.error("Please select a member");
            return;
        }

        if (!project?.id) {
            toast.error("Project ID is required");
            return;
        }

        setIsAdding(true);

        try {
            // Add member via API
            await projectAPI.addMember(project.id, {
                email: email.trim(),
            });

            // Reload workspaces to get updated member list
            await dispatch(fetchWorkspaces()).unwrap();

            toast.success(`Member "${email}" added successfully!`);

            // Reset form and close dialog
            setEmail('');
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error adding member:", error);
            toast.error(error.message || "Failed to add member. Please try again.");
        } finally {
            setIsAdding(false);
        }
    };

    if (!isDialogOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md text-zinc-900 dark:text-zinc-200 relative">
                {/* Close button */}
                <button
                    onClick={() => setIsDialogOpen(false)}
                    className="absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                    <XIcon className="size-5" />
                </button>

                {/* Header */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <UserPlus className="size-5 text-zinc-900 dark:text-zinc-200" /> Add Member to Project
                    </h2>
                    {project && (
                        <p className="text-sm text-zinc-700 dark:text-zinc-400">
                            Adding to Project: <span className="text-blue-600 dark:text-blue-400">{project.name}</span>
                        </p>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 w-4 h-4" />
                            {/* List All non project members from current workspace */}
                            <select value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 mt-1 w-full rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 text-sm placeholder-zinc-400 dark:placeholder-zinc-500 py-2 focus:outline-none focus:border-blue-500" required >
                                <option value="">Select a member</option>
                                {Array.isArray(currentWorkspace?.members) 
                                    ? currentWorkspace.members
                                        .filter((member) => !projectMembersEmails.includes(member?.user?.email))
                                        .map((member) => (
                                            <option key={member?.user?.id || member?.id} value={member?.user?.email || member?.email}> 
                                                {member?.user?.email || member?.email || 'N/A'} 
                                            </option>
                                        ))
                                    : null}
                            </select>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setIsDialogOpen(false)} className="px-5 py-2 text-sm rounded border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition" >
                            Cancel
                        </button>
                        <button type="submit" disabled={isAdding || !currentWorkspace} className="px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 hover:opacity-90 text-white disabled:opacity-50 transition" >
                            {isAdding ? "Adding..." : "Add Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectMember;
