
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AnimatedLogo } from '@/components/AnimatedLogo';

const Index = () => {
  const navigate = useNavigate();
  
  const goToLogin = () => navigate('/login');
  const goToSignup = () => navigate('/signup');
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
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
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground"
            onClick={goToLogin}
          >
            Log in
          </Button>
          <Button 
            onClick={goToSignup}
          >
            Get started
          </Button>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-24">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <motion.div 
            className="inline-block mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="p-3 rounded-full bg-primary/10">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-primary/30" />
              </div>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-medium tracking-tight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Beautiful, intuitive dashboard platform
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Designed with simplicity and functionality in mind. Experience the perfect balance of beauty and performance.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={goToSignup}
            >
              Start for free
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={goToLogin}
            >
              Log in
            </Button>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Features section */}
      <section className="px-6 py-16 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-2xl md:text-3xl font-medium text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Everything you need in one place
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Analytics",
                description: "Powerful analytics to understand your data and make better decisions."
              },
              {
                title: "User Management",
                description: "Manage user accounts, permissions, and access controls easily."
              },
              {
                title: "Customization",
                description: "Personalize your dashboard to fit your specific requirements."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <div className="w-6 h-6 rounded-full bg-primary/30" />
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <AnimatedLogo />
            <span className="text-lg font-medium">Platform</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
