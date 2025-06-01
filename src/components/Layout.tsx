import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-950 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-600/10 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary-500/10 via-transparent to-transparent"></div>
            
            {/* Animated grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>
            </div>

            <header className="border-b border-white/10 backdrop-blur-lg bg-dark-800/60 sticky top-0 z-50 shadow-lg shadow-primary-900/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {/* Logo/Icon placeholder */}
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-700/20">
                                <div className="w-4 h-4 bg-white rounded-sm opacity-90"></div>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-300 via-secondary-300 to-secondary-400 text-transparent bg-clip-text tracking-tight">
                                LoL Analytics
                            </h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {/* Status indicator */}
                            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/20">
                                <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                                <span className="text-xs text-accent-green font-medium">Live</span>
                            </div>
                            
                            <span className="text-xs text-dark-100 font-medium hidden md:inline-flex items-center space-x-2">
                                <span>Powered by</span>
                                <span className="px-2 py-1 rounded bg-gradient-to-r from-primary-500/10 to-secondary-500/10 text-primary-300 border border-primary-500/20">
                                    Grid.gg
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>

            <footer className="border-t border-white/10 backdrop-blur-lg bg-dark-800/60 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <p className="text-dark-200 text-sm">
                            © {new Date().getFullYear()} LoL Analytics Dashboard
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-dark-300">
                            <span className="flex items-center space-x-1">
                                <span>Powered by</span>
                                <span className="text-primary-400 font-medium">Grid.gg</span>
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">Real-time Analytics</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;