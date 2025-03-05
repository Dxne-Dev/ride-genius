
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Menu, Car, User, Search, MapPin, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Rechercher", path: "/search", icon: <Search className="mr-2 h-4 w-4" /> },
    { name: "Proposer", path: "/offer", icon: <Car className="mr-2 h-4 w-4" /> },
    { name: "Comment ça marche", path: "/how-it-works", icon: <MapPin className="mr-2 h-4 w-4" /> },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        scrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-border/40" 
          : "bg-transparent"
      )}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-carpu-gradient">
            RideGenius
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={cn(
                "px-4 py-2 rounded-lg flex items-center text-sm text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-colors",
                location.pathname === link.path && "bg-accent text-foreground font-medium"
              )}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <>
              <Button 
                asChild 
                variant="ghost" 
                size="sm" 
                className="flex items-center"
              >
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </Link>
              </Button>
              <Button 
                onClick={handleSignOut} 
                variant="outline" 
                size="sm" 
                className="flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Se connecter</Link>
              </Button>
              <Button asChild size="sm" className="bg-carpu-gradient hover:opacity-90 transition-opacity">
                <Link to="/signup">S'inscrire</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-foreground hover:bg-accent transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        <div 
          className={cn(
            "fixed inset-0 bg-background z-50 transition-transform duration-300 ease-in-out md:hidden",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="p-4 flex justify-between items-center border-b">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-carpu-gradient">
                RideGenius
              </span>
            </Link>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-foreground hover:bg-accent transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="p-4 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "p-3 rounded-lg flex items-center text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-colors",
                  location.pathname === link.path && "bg-accent text-foreground font-medium"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t space-y-2">
              {user ? (
                <>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full flex items-center"
                  >
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </Button>
                  <Button 
                    onClick={handleSignOut} 
                    variant="outline" 
                    className="w-full flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Se connecter
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-carpu-gradient hover:opacity-90 transition-opacity">
                    <Link to="/signup">S'inscrire</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
