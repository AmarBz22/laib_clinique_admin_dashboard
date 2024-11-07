import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { BiHome, BiCalendar, BiShoppingBag, BiBook, BiStats } from 'react-icons/bi';
import { IoMdCloseCircle } from 'react-icons/io';
import { FaSpinner } from 'react-icons/fa';
import { AuthContext } from '../../context/auth';

const SideBar = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { clearUserAuthInfo } = useContext(AuthContext);

  const handleLogout = () => {
    setIsLoading(true);
    clearUserAuthInfo();
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <aside className="md:fixed fixed top-0 h-full left-0 z-50 md:w-64 sm:w-1/2 w-3/4 bg-primary-pink text-white transition-all duration-300">
      <nav className="relative flex flex-col p-4 md:items-start items-center h-screen">
        {/* Logo Section */}
        <div className="flex justify-center items-center w-full">
          <div className="flex items-center mb-6">
            <BiBook className="text-3xl mr-2" />
            <h2 className="text-xl font-semibold">Laib Clinique</h2>
          </div>
          {isSidebarOpen && (
            <IoMdCloseCircle
              onClick={toggleSidebar}
              className="md:hidden absolute right-4 top-4 w-6 h-6"
              color="white"
            />
          )}
        </div>

        {/* Menu List */}
        <ul className="flex-1 space-y-4">
          {/* Tableau de bord */}
          <li>
            <Link
              to="/"
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
              className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition"
            >
              <BiHome className="mr-2" />
              <span className="font-semibold">Tableau de bord</span>
            </Link>
          </li>

          {/* Rendez-vous */}
          <li>
            <Link
              to="/appointments"
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
              className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition"
            >
              <BiCalendar className="mr-2" />
              <span className="font-semibold">Rendez-vous</span>
            </Link>
          </li>

          {/* Commandes */}
          <li>
            <Link
              to="/orders"
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
              className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition"
            >
              <BiShoppingBag className="mr-2" />
              <span className="font-semibold">Commandes</span>
            </Link>
          </li>

          {/* Produits */}
          <li>
            <Link
              to="/products"
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
              className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition"
            >
              <BiShoppingBag className="mr-2" />
              <span className="font-semibold">Produits</span>
            </Link>
          </li>

          {/* Cours */}
          <li>
            <Link
              to="/courses"
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
              className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition"
            >
              <BiBook className="mr-2" />
              <span className="font-semibold">Formations</span>
            </Link>
          </li>

          {/* Statistiques */}
          <li>
            <Link
              to="/statistics"
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
              className="flex items-center p-2 hover:bg-white hover:text-primary-pink rounded transition"
            >
              <BiStats className="mr-2" />
              <span className="font-semibold">Statistiques</span>
            </Link>
          </li>
        </ul>

        {/* Bouton de déconnexion */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-white text-primary-pink hover:bg-black p-2 rounded transition font-semibold flex items-center justify-center"
            disabled={isLoading}
          >
            Déconnexion
            {isLoading && <FaSpinner className="animate-spin ml-2" />}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;
