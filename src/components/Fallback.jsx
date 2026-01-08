const Fallback = () => {
    return (
        <div className='flex items-center justify-center h-screen bg-white dark:bg-zinc-950'>
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
            </div>
        </div>
    );
};

export default Fallback;
