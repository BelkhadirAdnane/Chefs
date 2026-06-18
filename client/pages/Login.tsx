import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IdCard, Lock, AlertCircle } from 'lucide-react';
import { loginChef } from '../lib/authService';
import LoginHelpWidget from '../components/LoginHelpWidget';

export default function Login() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cin, setCin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('[DEBUG LOGIN] Données du formulaire:');
      console.log('  firstName:', `"${firstName}"`);
      console.log('  lastName:', `"${lastName}"`);
      console.log('  cin:', `"${cin}"`);
      console.log('  password:', `"${password}"`);

      if (!firstName || !lastName || !cin || !password) {
        setError('Tous les champs sont requis');
        console.log('[DEBUG LOGIN] Erreur: champs manquants');
        return;
      }

      console.log('[DEBUG LOGIN] Appel du service loginChef...');
      const { data, error: authError } = await loginChef(cin, password);

      console.log('[DEBUG LOGIN] Réponse du service:');
      console.log('  data:', data);
      console.log('  error:', authError);

      if (authError) {
        setError(authError);
        console.log('[DEBUG LOGIN] Erreur d\'authentification:', authError);
        return;
      }

      if (data) {
        console.log('[DEBUG LOGIN] Vérification du nom/prénom:');
        console.log('  Formulaire - firstName:', `"${firstName}"`, '| lastName:', `"${lastName}"`);
        console.log('  BD - first_name:', `"${data.first_name}"`, '| last_name:', `"${data.last_name}"`);

        // Verify name matches (case-insensitive and trimmed)
        if (data.first_name.trim().toLowerCase() !== firstName.trim().toLowerCase() ||
            data.last_name.trim().toLowerCase() !== lastName.trim().toLowerCase()) {
          setError('Le nom ou prénom ne correspond pas au CIN');
          console.log('[DEBUG LOGIN] Erreur: nom/prénom ne correspond pas');
          return;
        }
        console.log('[DEBUG LOGIN] Vérification OK - redirection vers dashboard');
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
      console.error('[ERROR LOGIN]', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <LoginHelpWidget />
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fa9ce189e82c94247a809e38e319392c1%2Ff8865e41e45c4ddf97ad76d8d6891080?format=webp&width=120&height=120"
              alt="SHM Logo"
              className="w-24 h-24 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Portail des Chefs</h1>
            <p className="text-gray-600">Connexion à votre compte</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-slide-down">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dupont"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shm-red focus:border-transparent outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jean"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shm-red focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            {/* CIN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro CIN *
              </label>
              <div className="relative">
                <IdCard className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  placeholder="Votre numéro CIN"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shm-red focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shm-red focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-shm-red to-shm-purple text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-4">
            <div className="text-center text-xs text-gray-500">
              <p>Vous avez oublié votre mot de passe?</p>
              <p className="mt-1">Contactez votre administrateur SHM</p>
            </div>

            <div className="pt-4 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                Nouveau chef ?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-shm-red hover:text-shm-purple transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
