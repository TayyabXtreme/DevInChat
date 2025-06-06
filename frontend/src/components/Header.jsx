import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/user.context';

const Header = () => {
  const { user } = useContext(UserContext);

  return (
    <header className="bg-gray-900 text-white shadow-lg transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-500 transition-all duration-500">
                DevInChat
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline hover:underline-offset-4">
              Home
            </Link>
            <Link to="/projects" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline hover:underline-offset-4">
              Projects
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-full px-3 py-1 transition-all duration-300">
                    <span className="text-sm font-medium">{user.name || 'User'}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;