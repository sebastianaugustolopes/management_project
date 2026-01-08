import { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Layout from "./pages/Layout";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import Fallback from "./components/Fallback";
import { loadTheme } from "./features/themeSlice";

function AppRoutes() {
    const dispatch = useDispatch();

    // Load theme on app initialization
    useEffect(() => {
        dispatch(loadTheme());
    }, [dispatch]);

        return (
                <Suspense fallback={<Fallback />}>
                    <Routes>
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Auth />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="team" element={<Team />} />
                                <Route path="projects" element={<Projects />} />
                                <Route path="projectsDetail" element={<ProjectDetails />} />
                                <Route path="taskDetails" element={<TaskDetails />} />
                            </Route>
                        </Route>
                    </Routes>
                </Suspense>
    );
}

function App() {
    try {
        return (
            <>
                <Toaster />
                <AppRoutes />
            </>
        );
    } catch (error) {
        console.error('App error:', error);
        return (
            <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                        Erro ao carregar aplicação
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {error?.message || 'Erro desconhecido'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Recarregar
                    </button>
                </div>
            </div>
        );
    }
}

export default App;
