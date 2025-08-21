import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Keyboard,
  Timer,
  Palette,
  Moon,
  Sun,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingUp
} from 'lucide-react';

// Import pages
import HomePage from './pages/HomePage';
import LayoutListPage from './pages/LayoutListPage';
import LayoutDetailPage from './pages/LayoutDetailPage';
import DesignerPage from './pages/DesignerPage';
import RecommendationsPage from './pages/RecommendationsPage';
import TypingTestPage from './pages/TypingTestPage';
import AdaptiveTypingTest from './components/AdaptiveTypingTest';
import FullMethodology from './components/FullMethodology';

interface NavItem {
  path: string;
  name: string;
  icon: React.ReactNode;
}

const navigation: NavItem[] = [
  { path: '/', name: 'home', icon: <Home size={20} /> },
  { path: '/layouts', name: 'layouts', icon: <Keyboard size={20} /> },
  { path: '/designer', name: 'designer', icon: <Palette size={20} /> },
  { path: '/recommendations', name: 'recommendations', icon: <Target size={20} /> },
  { path: '/typingod', name: 'typingod', icon: <Timer size={20} /> },
  { path: '/methodology', name: 'methodology', icon: <TrendingUp size={20} /> },
];

interface NavigationProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

function Navigation({ isSidebarCollapsed, setIsSidebarCollapsed }: NavigationProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    localStorage.setItem('theme', newIsDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newIsDarkMode);
  };

  const toggleSidebar = () => {
    const newCollapsed = !isSidebarCollapsed;
    setIsSidebarCollapsed(newCollapsed);
    localStorage.setItem('sidebarCollapsed', newCollapsed.toString());
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-200 ease-out ${
        isSidebarCollapsed ? 'md:w-16' : 'md:w-64'
      }`}>
        <div className="sidebar-nav h-full">
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-dark-700 justify-between">
            <div className="flex items-center overflow-hidden">
              <Keyboard className="h-8 w-8 text-purple-600 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <span className="ml-3 text-lg font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  layoutgod
                </span>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white 
                       hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item group ${
                  location.pathname === item.path ? 'active' : ''
                } ${isSidebarCollapsed ? '!justify-center' : ''}`}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <div className={`flex items-center justify-center flex-shrink-0 ${
                  isSidebarCollapsed ? 'w-5 h-5' : 'w-5'
                }`}>{item.icon}</div>
                {!isSidebarCollapsed && (
                  <span className="ml-3 whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle and Credits */}
          <div className={`border-t border-gray-200 dark:border-dark-700 ${
            isSidebarCollapsed ? 'px-2 py-2' : 'px-2 py-4'
          }`}>
            <button
              onClick={toggleTheme}
              className={`flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors mb-3 min-h-[44px] ${
                         isSidebarCollapsed ? '!justify-center' : ''
                       }`}
              title={isSidebarCollapsed ? (isDarkMode ? 'light mode' : 'dark mode') : undefined}
            >
              <div className={`flex items-center justify-center flex-shrink-0 ${
                isSidebarCollapsed ? 'w-5 h-5' : 'w-5'
              }`}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              {!isSidebarCollapsed && (
                <span className="ml-3 whitespace-nowrap">
                  {isDarkMode ? 'light mode' : 'dark mode'}
                </span>
              )}
            </button>
            {!isSidebarCollapsed && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center px-2 mb-3">
                <p>layoutgod</p>
                <p>by rishik dulipyata</p>
                <div className="flex justify-center space-x-2 mt-2">
                  <a
                    href="https://linkedin.com/in/rishikdulipyata"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    title="linkedin"
                  >
                    linkedin
                  </a>
                  <span>•</span>
                  <a
                    href="https://github.com/RishikDulipyata"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                    title="github"
                  >
                    github
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Keyboard className="h-8 w-8 text-purple-600 mr-3" />
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                layoutgod
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 
                         dark:hover:text-white transition-colors"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 
                         dark:hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <nav className="mt-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}

function AppContent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Navigation isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />
      
      <div className={`transition-all duration-200 ease-out ${
        isSidebarCollapsed ? 'md:pl-16' : 'md:pl-64'
      }`}>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/layouts" element={<LayoutListPage />} />
            <Route path="/layouts/:slug" element={<LayoutDetailPage />} />
            <Route path="/designer" element={<DesignerPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/typingod" element={<TypingTestPage />} />
            <Route path="/adaptive-test" element={<AdaptiveTypingTest />} />
            <Route path="/methodology" element={<FullMethodology />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
