import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import BookExchange from './components/BookExchange';
import Events from './components/Events';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

function Dashboard() {
  const [currentPage, setCurrentPage] = useState<'books' | 'events' | 'admin'>('books');
  const { user } = useApp();

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {currentPage === 'books' && <BookExchange />}
      {currentPage === 'events' && <Events />}
      {currentPage === 'admin' && user?.role === 'admin' && <AdminPanel />}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </AppProvider>
  );
}

function AppRoutes() {
  const { user, authInitialized } = useApp() as any;
  // Avoid flashing login before auth is initialized
  if (!authInitialized) return null;
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={user ? <Dashboard /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
}

export default App;