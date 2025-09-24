import type React from 'react';
import { useState } from 'react';
import { BookOpen, Calendar, LogOut, Menu, X, Bell, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: 'books' | 'events' | 'admin';
  onPageChange: (page: 'books' | 'events' | 'admin') => void;
}

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout, notifications } = useApp();

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const navigation = [
    { id: 'books', name: 'Book Exchange', icon: BookOpen },
    { id: 'events', name: 'Events', icon: Calendar },
    ...(user?.role === 'admin' ? [{ id: 'admin', name: 'Admin Panel', icon: Shield }] : [])
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">Campus Connect</h1>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onPageChange(item.id as 'books' | 'events' | 'admin')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                        currentPage === item.id
                          ? item.id === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* User Menu and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Notifications - Desktop */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                              !notification.isRead ? 'bg-blue-50' : ''
                            }`}
                          >
                            <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{notification.content}</p>
                            <p className="text-gray-400 text-xs mt-2">
                              {notification.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 5 && (
                      <div className="p-3 border-t border-gray-200 text-center">
                        <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Info - Desktop */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {user?.name?.charAt(0)}
                  </div>
                  {isAdmin && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.department}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-3">
              {/* User Info - Mobile */}
              <div className="pb-3 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.department}</p>
                  </div>
                  {isAdmin && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              {/* Notifications - Mobile */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </div>
                {unreadNotifications > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>

              <div className="border-b border-gray-200 pb-3 mb-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              {/* Navigation - Mobile */}
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id as 'books' | 'events' | 'admin');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-3 ${
                      currentPage === item.id
                        ? item.id === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}

              {/* Logout - Mobile */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center space-x-3"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={`mx-auto px-4 sm:px-6 lg:px-8 py-6 ${
        currentPage === 'admin' ? 'max-w-full' : 'max-w-7xl'
      }`}>
        {children}
      </main>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}