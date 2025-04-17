
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Ticket, Search, Menu, X, Home, Play, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-background border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Film className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-white">CineVerse</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <Home className="mr-1 h-4 w-4" />
                Home
              </Link>
              <Link to="/movies" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <Play className="mr-1 h-4 w-4" />
                Movies
              </Link>
              <Link to="/tickets" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <Ticket className="mr-1 h-4 w-4" />
                Tickets
              </Link>
              <Link to="/admin/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <Settings className="mr-1 h-4 w-4" />
                Admin
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center justify-end space-x-4">
            {isSearchOpen ? (
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search movies..." 
                  className="w-64 bg-secondary text-white" 
                  autoFocus
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none"
              >
                <Search className="h-6 w-6" />
              </button>
            )}
            <Button variant="default" size="sm">
              Sign In
            </Button>
          </div>
          
          <div className="flex md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link to="/movies" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Movies
            </Link>
            <Link to="/tickets" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Tickets
            </Link>
            <Link to="/admin/login" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Admin
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-3">
                <div className="relative w-full">
                  <Input 
                    type="text" 
                    placeholder="Search movies..." 
                    className="w-full bg-secondary text-white" 
                  />
                  <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="mt-3 px-2">
                <Button className="w-full" variant="default">Sign In</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
