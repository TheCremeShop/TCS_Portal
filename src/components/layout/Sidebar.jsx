import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, LayoutGrid, Settings, LogOut, X, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const commonLinks = [
    { to: user?.role === 'admin' ? '/admin' : '/dashboard', icon: LayoutGrid, text: 'Data Grid', section: 'grid' },
  ];

  const adminLinks = [
    { to: '/admin', icon: Database, text: 'Databases', section: 'databases' },
  ];
  
  const userLinks = [];

  const navLinks = [
    ...commonLinks,
    ...(user?.role === 'admin' ? adminLinks : userLinks)
  ];
  
  const getActiveTabFromPath = () => {
    if (window.location.pathname.includes('/admin')) return 'databases';
    return 'grid';
  }
  
  const activeTab = getActiveTabFromPath();

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: {
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  const NavItem = ({ to, icon: Icon, text, section }) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={to}
            end={to === '/admin' || to === '/dashboard'}
            onClick={() => {
                if(window.innerWidth < 1024) setSidebarOpen(false)
            }}
            className={({ isActive }) =>
              `flex items-center justify-center lg:justify-start p-3 my-1 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="ml-4 text-sm font-medium hidden lg:block">{text}</span>
          </NavLink>
        </TooltipTrigger>
        <TooltipContent side="right" className="lg:hidden glass-effect border-white/20 text-white">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></motion.div>
        )}
      </AnimatePresence>

      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={sidebarOpen ? 'open' : 'closed'}
        className="fixed lg:relative lg:translate-x-0 inset-y-0 left-0 w-20 lg:w-64 z-50 flex flex-col glass-effect border-r border-white/10 p-4"
      >
        <div className="flex items-center justify-between lg:justify-start flex-shrink-0 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white hidden lg:block">DataGrid Pro</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex-1">
          {navLinks.map((link) => (
             <NavItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="mt-auto">
          <NavItem to="/settings" icon={Settings} text="Settings" />
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center lg:justify-start p-3 my-1 rounded-lg transition-colors duration-200 text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span className="ml-4 text-sm font-medium hidden lg:block">Logout</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="lg:hidden glass-effect border-white/20 text-white">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;