import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, registerUser, clearError } from "../features/authSlice";
import { Mail, Lock, User, ArrowRight, FolderKanban, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

// Reusable Input Field Component
const FormField = ({ 
    label, 
    type = "text", 
    icon: Icon, 
    value, 
    onChange, 
    placeholder, 
    required = false, 
    disabled = false,
    minLength
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
            {label}
        </label>
        <div className="relative">
            {Icon && (
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 dark:text-zinc-500" />
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                required={required}
                disabled={disabled}
                minLength={minLength}
            />
        </div>
    </div>
);

// Reusable Submit Button Component
const SubmitButton = ({ loading, children, loadingText }) => (
    <button
        type="submit"
        disabled={loading}
        className="group w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
    >
        {loading ? (
            loadingText
        ) : (
            <>
                {children}
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </>
        )}
    </button>
);

const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    // Determine initial mode based on route
    const [isLogin, setIsLogin] = useState(location.pathname === "/login");
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Update mode when route changes
    useEffect(() => {
        setIsLogin(location.pathname === "/login");
    }, [location.pathname]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!loginData.email || !loginData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const result = await dispatch(
                loginUser({
                    email: loginData.email,
                    password: loginData.password,
                })
            ).unwrap();

            toast.success(`Welcome back, ${result.user.name}!`);
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!registerData.name || !registerData.email || !registerData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (registerData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            const result = await dispatch(
                registerUser({
                    name: registerData.name,
                    email: registerData.email,
                    password: registerData.password,
                })
            ).unwrap();

            toast.success(`Welcome, ${result.user.name}! Account created successfully.`);
            navigate("/");
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20 dark:border-zinc-800/50">
                
                
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg mb-4">
                    <FolderKanban className="size-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-gray-600 dark:text-zinc-400">
                        {isLogin ? "Sign in to your account to continue" : "Start managing your projects today"}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-zinc-800 rounded-xl p-1">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(true);
                            navigate("/login", { replace: true });
                        }}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                            isLogin
                                ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(false);
                            navigate("/register", { replace: true });
                        }}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                            !isLogin
                                ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Login Form */}
                {isLogin && (
                    <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in duration-200">
                        <FormField
                            label="Email Address"
                            type="email"
                            icon={Mail}
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            placeholder="you@example.com"
                            required
                            disabled={loading}
                        />
                        <FormField
                            label="Password"
                            type="password"
                            icon={Lock}
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                        <SubmitButton loading={loading} loadingText="Signing in...">
                            Sign In
                        </SubmitButton>
                    </form>
                )}

                {/* Register Form */}
                {!isLogin && (
                    <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in duration-200">
                        <FormField
                            label="Full Name"
                            type="text"
                            icon={User}
                            value={registerData.name}
                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                            placeholder="John Doe"
                            required
                            disabled={loading}
                        />
                        <FormField
                            label="Email Address"
                            type="email"
                            icon={Mail}
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            placeholder="you@example.com"
                            required
                            disabled={loading}
                        />
                        <FormField
                            label="Password"
                            type="password"
                            icon={Lock}
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            placeholder="At least 6 characters"
                            required
                            disabled={loading}
                            minLength={6}
                        />
                        <FormField
                            label="Confirm Password"
                            type="password"
                            icon={Lock}
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                            placeholder="Confirm your password"
                            required
                            disabled={loading}
                            minLength={6}
                        />
                        <SubmitButton loading={loading} loadingText="Creating account...">
                            Create Account
                        </SubmitButton>
                    </form>
                )}

                {/* Switch between forms */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => {
                                if (isLogin) {
                                    setIsLogin(false);
                                    navigate("/register", { replace: true });
                                } else {
                                    setIsLogin(true);
                                    navigate("/login", { replace: true });
                                }
                            }}
                            className="text-blue-600 dark:text-blue-400 font-medium hover:underline transition"
                        >
                            {isLogin ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
