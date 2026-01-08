import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { deleteTask, updateTask, fetchWorkspaces } from "../features/workspaceSlice";
import { taskAPI } from "../services/api";
import { Bug, CalendarIcon, GitCommit, MessageSquare, Square, Trash, XIcon, Zap } from "lucide-react";

const typeIcons = {
    BUG: { icon: Bug, color: "text-red-600 dark:text-red-400" },
    FEATURE: { icon: Zap, color: "text-blue-600 dark:text-blue-400" },
    TASK: { icon: Square, color: "text-green-600 dark:text-green-400" },
    IMPROVEMENT: { icon: GitCommit, color: "text-purple-600 dark:text-purple-400" },
    OTHER: { icon: MessageSquare, color: "text-amber-600 dark:text-amber-400" },
};

const priorityTexts = {
    LOW: { background: "bg-red-100 dark:bg-red-950", prioritycolor: "text-red-600 dark:text-red-400" },
    MEDIUM: { background: "bg-blue-100 dark:bg-blue-950", prioritycolor: "text-blue-600 dark:text-blue-400" },
    HIGH: { background: "bg-emerald-100 dark:bg-emerald-950", prioritycolor: "text-emerald-600 dark:text-emerald-400" },
};

const ProjectTasks = ({ tasks }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedTasks, setSelectedTasks] = useState([]);

    const [filters, setFilters] = useState({
        status: "",
        type: "",
        priority: "",
        assignee: "",
    });
    const [searchTerm, setSearchTerm] = useState("");

    // Ensure tasks is always an array
    const safeTasks = Array.isArray(tasks) ? tasks : [];

    const assigneeList = useMemo(
        () => Array.from(new Set(safeTasks.map((t) => t?.assignee?.name).filter(Boolean))),
        [safeTasks]
    );

    const filteredTasks = useMemo(() => {
        return safeTasks.filter((task) => {
            if (!task) return false;
            
            // Text search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch = 
                    task?.title?.toLowerCase().includes(searchLower) ||
                    task?.description?.toLowerCase().includes(searchLower) ||
                    task?.type?.toLowerCase().includes(searchLower) ||
                    task?.status?.toLowerCase().includes(searchLower) ||
                    task?.priority?.toLowerCase().includes(searchLower) ||
                    task?.assignee?.name?.toLowerCase().includes(searchLower);
                
                if (!matchesSearch) return false;
            }
            
            // Filter by status, type, priority, assignee
            const { status, type, priority, assignee } = filters;
            return (
                (!status || task.status === status) &&
                (!type || task.type === type) &&
                (!priority || task.priority === priority) &&
                (!assignee || task.assignee?.name === assignee)
            );
        });
    }, [filters, safeTasks, searchTerm]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            toast.loading("Updating status...");

            const task = safeTasks.find((t) => t?.id === taskId);
            if (!task) {
                toast.dismissAll();
                toast.error("Task not found");
                return;
            }

            // Update task via API
            const updatedTask = await taskAPI.update(taskId, {
                projectId: task?.projectId,
                title: task?.title || '',
                description: task?.description || null,
                type: task?.type || 'TASK',
                status: newStatus,
                priority: task?.priority || 'MEDIUM',
                assigneeId: task?.assigneeId || task?.assignee?.id || null,
                dueDate: task?.dueDate || task?.due_date || null,
            });

            dispatch(updateTask(updatedTask));
            
            // Reload workspaces to get updated data
            await dispatch(fetchWorkspaces()).unwrap();

            toast.dismissAll();
            toast.success("Task status updated successfully");
        } catch (error) {
            toast.dismissAll();
            toast.error(error?.message || "Failed to update task status");
        }
    };

    const handleDelete = async () => {
        try {
            const confirm = window.confirm("Are you sure you want to delete the selected tasks?");
            if (!confirm) return;

            if (!Array.isArray(selectedTasks) || selectedTasks.length === 0) {
                toast.error("No tasks selected");
                return;
            }

            toast.loading("Deleting tasks...");

            // Delete tasks via API
            await Promise.all(selectedTasks.map(taskId => taskAPI.delete(taskId)));

            // For bulk delete, we can pass array of IDs - the reducer will handle it
            dispatch(deleteTask(selectedTasks));
            
            // Reload workspaces to get updated data
            await dispatch(fetchWorkspaces()).unwrap();

            setSelectedTasks([]);
            toast.dismissAll();
            toast.success("Tasks deleted successfully");
        } catch (error) {
            toast.dismissAll();
            toast.error(error?.message || "Failed to delete tasks");
        }
    };

    const handleDeleteSingleTask = async (e, taskId, taskTitle) => {
        e.stopPropagation(); // Prevent navigating to task details
        
        const confirm = window.confirm(`Are you sure you want to delete "${taskTitle}"?`);
        if (!confirm) return;

        try {
            toast.loading("Deleting task...");

            // Find the task to get its projectId
            const taskToDelete = tasks.find(t => t.id === taskId);
            if (!taskToDelete) {
                toast.dismissAll();
                toast.error("Task not found");
                return;
            }

            // Delete task via API
            await taskAPI.delete(taskId);

            dispatch(deleteTask({ id: taskId, projectId: taskToDelete.projectId }));
            
            // Reload workspaces to get updated data
            await dispatch(fetchWorkspaces()).unwrap();

            toast.dismissAll();
            toast.success("Task deleted successfully");
        } catch (error) {
            toast.dismissAll();
            toast.error(error?.message || "Failed to delete task");
        }
    };

    return (
        <div>
            {/* Search and Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-3 pr-3 py-1 rounded border border-zinc-300 dark:border-zinc-800 outline-none text-sm text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                {["status", "type", "priority", "assignee"].map((name) => {
                    const options = {
                        status: [
                            { label: "All Statuses", value: "" },
                            { label: "To Do", value: "TODO" },
                            { label: "In Progress", value: "IN_PROGRESS" },
                            { label: "Done", value: "DONE" },
                        ],
                        type: [
                            { label: "All Types", value: "" },
                            { label: "Task", value: "TASK" },
                            { label: "Bug", value: "BUG" },
                            { label: "Feature", value: "FEATURE" },
                            { label: "Improvement", value: "IMPROVEMENT" },
                            { label: "Other", value: "OTHER" },
                        ],
                        priority: [
                            { label: "All Priorities", value: "" },
                            { label: "Low", value: "LOW" },
                            { label: "Medium", value: "MEDIUM" },
                            { label: "High", value: "HIGH" },
                        ],
                        assignee: [
                            { label: "All Assignees", value: "" },
                            ...assigneeList.map((n) => ({ label: n, value: n })),
                        ],
                    };
                    return (
                        <select key={name} name={name} onChange={handleFilterChange} className=" border not-dark:bg-white border-zinc-300 dark:border-zinc-800 outline-none px-3 py-1 rounded text-sm text-zinc-900 dark:text-zinc-200" >
                            {options[name].map((opt, idx) => (
                                <option key={idx} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    );
                })}

                {/* Reset filters */}
                {(filters.status || filters.type || filters.priority || filters.assignee || searchTerm) && (
                    <button type="button" onClick={() => {
                        setFilters({ status: "", type: "", priority: "", assignee: "" });
                        setSearchTerm("");
                    }} className="px-3 py-1 flex items-center gap-2 rounded bg-gradient-to-br from-purple-400 to-purple-500 text-zinc-100 dark:text-zinc-200 text-sm transition-colors" >
                        <XIcon className="size-3" /> Reset
                    </button>
                )}

                {selectedTasks.length > 0 && (
                    <button type="button" onClick={handleDelete} className="px-3 py-1 flex items-center gap-2 rounded bg-gradient-to-br from-indigo-400 to-indigo-500 text-zinc-100 dark:text-zinc-200 text-sm transition-colors" >
                        <Trash className="size-3" /> Delete
                    </button>
                )}
            </div>

            {/* Tasks Table */}
            <div className="overflow-auto rounded-lg lg:border border-zinc-300 dark:border-zinc-800">
                <div className="w-full">
                    {/* Desktop/Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full text-sm text-left not-dark:bg-white text-zinc-900 dark:text-zinc-300">
                            <thead className="text-xs uppercase dark:bg-zinc-800/70 text-zinc-500 dark:text-zinc-400 ">
                                <tr>
                                    <th className="pl-2 pr-1">
                                        <input onChange={() => selectedTasks.length > 1 ? setSelectedTasks([]) : setSelectedTasks(safeTasks.map((t) => t?.id).filter(Boolean))} checked={selectedTasks.length === safeTasks.length && safeTasks.length > 0} type="checkbox" className="size-3 accent-zinc-600 dark:accent-zinc-500" />
                                    </th>
                                    <th className="px-4 pl-0 py-3">Title</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Priority</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Assignee</th>
                                    <th className="px-4 py-3">Due Date</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(filteredTasks) && filteredTasks.length > 0 ? (
                                    filteredTasks.map((task) => {
                                        if (!task) return null;
                                        const { icon: Icon, color } = typeIcons[task?.type] || {};
                                        const { background, prioritycolor } = priorityTexts[task?.priority] || {};

                                        return (
                                            <tr key={task?.id} onClick={() => navigate(`/taskDetails?projectId=${task?.projectId}&taskId=${task?.id}`)} className=" border-t border-zinc-300 dark:border-zinc-800 group hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all cursor-pointer" >
                                                <td onClick={e => e.stopPropagation()} className="pl-2 pr-1">
                                                    <input type="checkbox" className="size-3 accent-zinc-600 dark:accent-zinc-500" onChange={() => selectedTasks.includes(task?.id) ? setSelectedTasks(selectedTasks.filter((i) => i !== task?.id)) : setSelectedTasks((prev) => [...prev, task?.id])} checked={selectedTasks.includes(task?.id)} />
                                                </td>
                                                <td className="px-4 pl-0 py-2">{task?.title || 'N/A'}</td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        {Icon && <Icon className={`size-4 ${color}`} />}
                                                        <span className={`uppercase text-xs ${color}`}>{task?.type || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`text-xs px-2 py-1 rounded ${background} ${prioritycolor}`}>
                                                        {task?.priority || 'N/A'}
                                                    </span>
                                                </td>
                                                <td onClick={e => e.stopPropagation()} className="px-4 py-2">
                                                    <select name="status" onChange={(e) => handleStatusChange(task?.id, e.target.value)} value={task?.status || 'TODO'} className="group-hover:ring ring-zinc-100 outline-none px-2 pr-4 py-1 rounded text-sm text-zinc-900 dark:text-zinc-200 cursor-pointer" >
                                                        <option value="TODO">To Do</option>
                                                        <option value="IN_PROGRESS">In Progress</option>
                                                        <option value="DONE">Done</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <img src={task?.assignee?.image || ''} className="size-5 rounded-full" alt="avatar" />
                                                        {task?.assignee?.name || "-"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                                                        <CalendarIcon className="size-4" />
                                                        {(task.dueDate || task.due_date) ? format(new Date(task.dueDate || task.due_date), "dd MMMM") : "-"}
                                                    </div>
                                                </td>
                                                <td onClick={e => e.stopPropagation()} className="px-4 py-2">
                                                    <button
                                                        onClick={(e) => handleDeleteSingleTask(e, task.id, task.title)}
                                                        className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Delete task"
                                                    >
                                                        <Trash className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center text-zinc-500 dark:text-zinc-400 py-6">
                                            No tasks found for the selected filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile/Card View */}
                    <div className="lg:hidden flex flex-col gap-4">
                        {Array.isArray(filteredTasks) && filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => {
                                if (!task) return null;
                                const { icon: Icon, color } = typeIcons[task?.type] || {};
                                const { background, prioritycolor } = priorityTexts[task?.priority] || {};

                                return (
                                    <div key={task.id} className=" dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4 flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-zinc-900 dark:text-zinc-200 text-sm font-semibold">{task.title}</h3>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => handleDeleteSingleTask(e, task.id, task.title)}
                                                    className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                    title="Delete task"
                                                >
                                                    <Trash className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                </button>
                                            <input type="checkbox" className="size-4 accent-zinc-600 dark:accent-zinc-500" onChange={() => selectedTasks.includes(task.id) ? setSelectedTasks(selectedTasks.filter((i) => i !== task.id)) : setSelectedTasks((prev) => [...prev, task.id])} checked={selectedTasks.includes(task.id)} />
                                            </div>
                                        </div>

                                        <div className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                                            {Icon && <Icon className={`size-4 ${color}`} />}
                                            <span className={`${color} uppercase`}>{task.type}</span>
                                        </div>

                                        <div>
                                            <span className={`text-xs px-2 py-1 rounded ${background} ${prioritycolor}`}>
                                                {task.priority}
                                            </span>
                                        </div>

                                        <div>
                                            <label className="text-zinc-600 dark:text-zinc-400 text-xs">Status</label>
                                            <select name="status" onChange={(e) => handleStatusChange(task.id, e.target.value)} value={task.status} className="w-full mt-1 bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-300 dark:ring-zinc-700 outline-none px-2 py-1 rounded text-sm text-zinc-900 dark:text-zinc-200" >
                                                <option value="TODO">To Do</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="DONE">Done</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                                            <img src={task.assignee?.image} className="size-5 rounded-full" alt="avatar" />
                                            {task.assignee?.name || "-"}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                            <CalendarIcon className="size-4" />
                                            {(task.dueDate || task.due_date) ? format(new Date(task.dueDate || task.due_date), "dd MMMM") : "-"}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-zinc-500 dark:text-zinc-400 py-4">
                                No tasks found for the selected filters.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectTasks;
