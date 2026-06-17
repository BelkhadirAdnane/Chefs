export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">📋 SHM</h3>
            <p className="text-gray-400 text-sm">
              Plateforme de gestion et supervision pour les chefs du Scoutisme Hassani Marocain.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">🔗 Accès Rapide</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Mon Profil
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Membres
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">❓ Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Centre d'aide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">ℹ️ Infos</h3>
            <p className="text-sm text-gray-400">
              <span className="block">Portail v1.0</span>
              <span className="block">{currentYear} © SHM</span>
              <span className="block text-xs mt-2">Tous droits réservés</span>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Portail des Chefs SHM. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Plateforme de gestion des troupes et supervision des membres
          </p>
        </div>
      </div>
    </footer>
  );
}
