
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

type NavLinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
};

export function NavLink({ 
  to, 
  children, 
  className = '', 
  activeClassName = 'text-primary font-medium'
}: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        'transition-all duration-200 hover:text-primary/90',
        className,
        isActive ? activeClassName : ''
      )}
    >
      {children}
    </Link>
  );
}
