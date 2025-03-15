
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Settings, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedLogo } from './AnimatedLogo';

type SidebarItem = {
  icon: React.ElementType;
  label: string;
  href: string;
};

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Users, label: 'Users', href: '/dashboard/users' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const handleLogout = () => {
    // This would be replaced with actual logout logic
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    // Redirect to login page
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside 
        className={cn(
          "fixed lg:relative z-50 lg:z-auto h-full w-64 bg-card border-r border-border/50 shadow-sm",
          "transition-transform lg:transform-none",
          isMobile && !isSidebarOpen && "-translate-x-full"
        )}
        initial={isMobile ? { x: -320 } : false}
        animate={isMobile ? { x: isSidebarOpen ? 0 : -320 } : {}}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Sidebar header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border/50">
          <Link to="/dashboard" className="flex items-center gap-2">
            <AnimatedLogo />
            <span className="font-medium">Platform</span>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={toggleSidebar}
          >
            <X size={18} />
          </Button>
        </div>
        
        {/* Sidebar content */}
        <div className="p-4 space-y-8">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="pt-4 border-t border-border/50">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 px-4 border-b border-border/50 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={toggleSidebar}
          >
            <Menu size={18} />
          </Button>
          
          <div className="text-sm font-medium ml-auto">
            {/* User info would go here */}
            Welcome back
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
