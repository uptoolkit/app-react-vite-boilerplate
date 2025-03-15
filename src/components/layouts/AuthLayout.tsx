import { motion } from 'framer-motion';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { NavLink } from '@/components/NavLink';

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  backTo?: {
    label: string;
    path: string;
  };
};

export function AuthLayout({ 
  children, 
  title, 
  subtitle,
  backTo
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left illustration panel - only visible on medium screens and up */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="relative w-full max-w-md aspect-square">
            <motion.div 
              className="absolute inset-0 rounded-full bg-primary/5 animate-spin-slow"
              style={{ borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%' }}
            />
            <motion.div 
              className="absolute inset-4 rounded-full bg-primary/5"
              animate={{ 
                borderRadius: [
                  '38% 62% 63% 37% / 41% 44% 56% 59%', 
                  '45% 55% 52% 48% / 56% 48% 52% 44%', 
                  '38% 62% 63% 37% / 41% 44% 56% 59%'
                ]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-4xl font-light text-primary/80"
              >
                Dashboard
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right content panel */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="px-6 py-4 flex items-center justify-between border-b border-border/40">
          <div className="flex items-center gap-2">
            <AnimatedLogo />
            <motion.span 
              className="text-lg font-medium"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Platform
            </motion.span>
          </div>
          
          {backTo && (
            <NavLink to={backTo.path} className="text-sm text-muted-foreground hover:text-foreground">
              {backTo.label}
            </NavLink>
          )}
        </header>
        
        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-8 text-center">
              <motion.h1 
                className="text-2xl font-semibold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h1>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {subtitle}
              </motion.p>
            </div>
            
            {children}
          </motion.div>
        </main>
        
        <footer className="py-4 px-6 border-t border-border/40">
          <div className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Platform. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
