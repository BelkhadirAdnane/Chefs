import { LogOut, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
  userName?: string;
}

export default function Header({ onMenuClick, userName = 'Chef' }: HeaderProps) {
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="shm-gradient sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition">
          <div className="text-white text-2xl md:text-3xl font-bold">SHM</div>
          <div className="hidden sm:block">
            <p className="text-white font-semibold text-sm">Portail des Chefs</p>
            <p className="text-white/70 text-xs">Gestion & Supervision</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-white hover:text-gray-200 transition-colors font-medium text-sm"
            >
              Dashboard
            </Link>
            <Link
              to="/account"
              className="text-white hover:text-gray-200 transition-colors font-medium text-sm"
            >
              Mon Compte
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* User Info - Desktop Only */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-white font-semibold text-sm">{userName}</p>
              <p className="text-white/70 text-xs">Chef</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
              title="Déconnexion"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
