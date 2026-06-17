import { useState } from 'react';
import { Users, BarChart3, FileText, Calendar, Lightbulb, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock statistics
  const stats = [
    {
      icon: Users,
      label: 'Nombre total de membres',
      value: '156',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: BarChart3,
      label: 'Nombre de chefs',
      value: '12',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: FileText,
      label: 'Rapports enregistrés',
      value: '34',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Calendar,
      label: 'Séances organisées',
      value: '28',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Lightbulb,
      label: 'Idées proposées',
      value: '47',
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  // Mock recent activity
  const recentActivity = [
    {
      type: 'report',
      title: 'Rapport de séance - Patrouille Alpha',
      date: 'Aujourd\'hui à 14:30',
      icon: FileText,
    },
    {
      type: 'session',
      title: 'Séance programmée - Nœuds et amarrages',
      date: 'Demain à 16:00',
      icon: Calendar,
    },
    {
      type: 'idea',
      title: 'Nouvelle idée : Sortie en montagne',
      date: 'Hier à 10:15',
      icon: Lightbulb,
    },
    {
      type: 'member',
      title: 'Nouveau membre : Ahmed Hassan',
      date: '2 jours ago',
      icon: Users,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} userName="Chef Principal" />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="section-title">Tableau de Bord</h1>
            <p className="text-gray-600">Bienvenue sur le portail de supervision des chefs SHM</p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {stats.map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="stat-card group hover:scale-105"
              >
                <div className={`bg-gradient-to-br ${color} p-4 rounded-lg mb-4 inline-block`}>
                  <Icon className="text-white" size={24} />
                </div>
                <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <div className="flex items-center gap-1 mt-2 text-green-600 text-xs">
                  <TrendingUp size={14} />
                  <span>+2.5% ce mois</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Activities Section */}
            <div className="bg-white rounded-lg shadow-md p-6 shm-glow">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="bg-shm-red/10 p-2 rounded-lg">
                  <TrendingUp className="text-shm-red" size={24} />
                </div>
                Activité Récente
              </h2>
              
              <div className="space-y-4">
                {recentActivity.map(({ type, title, date, icon: Icon }) => (
                  <div
                    key={type}
                    className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <div className="bg-gray-100 p-3 rounded-lg flex-shrink-0 mt-1">
                      <Icon className="text-shm-red" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                        {title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{date}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-shm-red hover:text-shm-purple font-semibold text-sm py-2 transition-colors">
                Voir toute l'activité →
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 shm-glow">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
                Actions Rapides
              </h2>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-shm-red to-shm-purple text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200">
                  Ajouter un Rapport
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                  Programmer une Séance
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                  Consulter les Membres
                </button>
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                  Gérer les Idées
                </button>
              </div>

              {/* Quick Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>💡 Conseil:</strong> Consultez les rapports régulièrement pour une meilleure supervision de vos troupes.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
