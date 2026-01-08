import { X, FolderKanban, Users, CheckCircle2, LayoutDashboard, ClipboardList } from 'lucide-react';

const AboutDialog = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const socialLinks = {
        linkedin: "https://www.linkedin.com/in/sebastianaugusto/",
        github: "https://github.com/sebastianaugustolopes",
        instagram: "https://www.instagram.com/ssebastianaugusto"
    };

    const features = [
        { icon: LayoutDashboard, title: "Workspaces", desc: "Crie e gerencie múltiplos espaços de trabalho" },
        { icon: CheckCircle2, title: "Projetos", desc: "Organize e acompanhe o progresso dos projetos" },
        { icon: ClipboardList, title: "Tarefas", desc: "Gerencie tarefas com diferentes prioridades" },
        { icon: Users, title: "Equipe", desc: "Colabore em tempo real com sua equipe" },
    ];

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl shadow-2xl w-full max-w-3xl text-zinc-900 dark:text-zinc-100 relative animate-in zoom-in-95 duration-200 overflow-hidden">
            
                
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all hover:rotate-90 duration-300 z-10"
                >
                    <X className="size-5" />
                </button>

                {/* Header with icon */}
                <div className="relative px-8 pt-8 pb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg mb-4">
                        <FolderKanban className="size-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                        Sobre o Projeto
                    </h2>
                    <p className="text-gray-600 dark:text-zinc-400">
                        Sistema de Gerenciamento de Projetos
                    </p>
                </div>

                {/* Content */}
                <div className="px-8 pb-6 space-y-6">
                    
                    {/* Resumo */}
                    <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-5 border border-gray-200 dark:border-zinc-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                            Resumo
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
                            Esta é uma aplicação completa de gerenciamento de projetos desenvolvida para ajudar equipes 
                            a organizar, acompanhar e colaborar em projetos de forma eficiente. O sistema permite criar 
                            workspaces, gerenciar projetos, atribuir tarefas e acompanhar o progresso em tempo real.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                            Principais Funções
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {features.map((feature, i) => (
                                <div 
                                    key={i}
                                    className="group bg-white dark:bg-zinc-800/50 rounded-xl p-4 border border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full"
                                >
                                    <div className="flex items-start gap-3 h-full">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors flex-shrink-0">
                                            <feature.icon className="size-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
                                                {feature.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-snug">
                                                {feature.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Additional features as compact list */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {[
                                "💬 Comentários",
                                "📊 Dashboard",
                                "🔍 Filtros avançados"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-800/50 px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700">
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="border-t border-gray-200 dark:border-zinc-800 pt-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full" />
                            Conecte-se
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href={socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <svg className="size-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                <span className="font-medium">LinkedIn</span>
                            </a>
                            <a
                                href={socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 dark:from-zinc-700 dark:to-zinc-800 hover:from-gray-900 hover:to-black dark:hover:from-zinc-800 dark:hover:to-zinc-900 text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <svg className="size-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                <span className="font-medium">GitHub</span>
                            </a>
                            <a
                                href={socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <svg className="size-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                                <span className="font-medium">Instagram</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutDialog;