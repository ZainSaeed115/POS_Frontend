import { useState, useEffect } from 'react';
import { Home, ShoppingBasket, TagsIcon, TrendingUp, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { authUser,  logoutUser } = useAuthStore(); // Assuming you have a logout function in your store
   
  // Check if current route is active
  const isActive = (path) => location.pathname === path;

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutUser() // Call your logout function
  };

  return (
    <>
      {authUser ? (
        <>
          <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                {/* Logo */}
                <Link to="/" className="flex-shrink-0 flex items-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    E-POS
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:space-x-8 md:ml-10">
                  <Link
                    to="/"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive('/')
                        ? 'border-indigo-500 text-gray-900 font-semibold'
                        : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
                    }`}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                  
                  <Link
                    to="/product"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive('/product')
                        ? 'border-indigo-500 text-gray-900 font-semibold'
                        : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
                    }`}
                  >
                    <ShoppingBasket className="mr-2 h-4 w-4" />
                    Products
                  </Link>

                  <Link
                    to="/category"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive('/category')
                        ? 'border-indigo-500 text-gray-900 font-semibold'
                        : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
                    }`}
                  >
                    <TagsIcon className="mr-2 h-4 w-4" />
                    Category
                  </Link>
                  
                  <Link
                    to="/sales"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive('/sales')
                        ? 'border-indigo-500 text-gray-900 font-semibold'
                        : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
                    }`}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Sales
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-colors duration-200 shadow-sm"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open main menu</span>
                    {mobileMenuOpen ? (
                      <X className="block h-6 w-6" />
                    ) : (
                      <Menu className="block h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
              <div className="pt-2 pb-3 space-y-1 bg-white shadow-lg border-t border-gray-200">
                <Link
                  to="/"
                  className={`block pl-3 pr-4 py-3 border-l-4 text-base font-medium transition-colors duration-200 ${
                    isActive('/')
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <Home className="mr-3 h-5 w-5" />
                    Home
                  </div>
                </Link>
                
                <Link
                  to="/product"
                  className={`block pl-3 pr-4 py-3 border-l-4 text-base font-medium transition-colors duration-200 ${
                    isActive('/product')
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <ShoppingBasket className="mr-3 h-5 w-5" />
                    Products
                  </div>
                </Link>

                <Link
                  to="/category"
                  className={`block pl-3 pr-4 py-3 border-l-4 text-base font-medium transition-colors duration-200 ${
                    isActive('/category')
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <TagsIcon className="mr-3 h-5 w-5" />
                    category
                  </div>
                </Link>
                
                <Link
                  to="/sales"
                  className={`block pl-3 pr-4 py-3 border-l-4 text-base font-medium transition-colors duration-200 ${
                    isActive('/sales')
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <TrendingUp className="mr-3 h-5 w-5" />
                    Sales
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </div>
                </button>
              </div>
            </div>
          </nav>
        </>
      ) : null}
    </>
  );
};

export default Navbar;