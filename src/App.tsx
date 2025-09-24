import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import BookExchange from './components/BookExchange';
import Events from './components/Events';
import AdminPanel from './components/AdminPanel';

function AppContent() {
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
      <AppContent />
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

export default App;