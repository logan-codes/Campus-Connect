import { useState } from 'react';
import { MessageCircle, Plus, Search, Filter, Book, DollarSign, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
// ...existing code...
import BookModal from './BookModal';
import ChatModal from './ChatModal';

export default function BookExchange() {
  const [showBookModal, setShowBookModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sell' | 'buy' | 'exchange'>('all');
  const { books } = useApp();

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || book.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleMessageClick = (bookId: string) => {
    setSelectedBookId(bookId);
    setShowChatModal(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sell': return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'buy': return <Book className="w-4 h-4 text-blue-600" />;
      case 'exchange': return <RefreshCw className="w-4 h-4 text-orange-600" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sell': return 'bg-green-100 text-green-800';
      case 'buy': return 'bg-blue-100 text-blue-800';
      case 'exchange': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Exchange</h1>
          <p className="text-gray-600 text-lg">
            Making it easier for students to buy, sell, and exchange books hassle-free
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={() => setFilterType(filterType === 'sell' ? 'all' : 'sell')}
            className={`px-6 py-3 rounded-lg border-2 font-medium transition-all flex items-center space-x-2 ${
              filterType === 'sell'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-300 text-gray-700 hover:border-green-500 hover:bg-green-50'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>I Have This Book</span>
          </button>
          
          <button
            onClick={() => setFilterType(filterType === 'buy' ? 'all' : 'buy')}
            className={`px-6 py-3 rounded-lg border-2 font-medium transition-all flex items-center space-x-2 ${
              filterType === 'buy'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <Book className="w-4 h-4" />
            <span>I Need This Book</span>
          </button>
          
          <button
            onClick={() => setShowBookModal(true)}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Listing</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'sell' | 'buy' | 'exchange')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="sell">For Sale</option>
              <option value="buy">Wanted</option>
              <option value="exchange">Exchange</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book Listings */}
      <div className="space-y-4">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to post a book listing!'
              }
            </p>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Book className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{book.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getTypeColor(book.type)}`}>
                        {getTypeIcon(book.type)}
                        <span className="capitalize">{book.type}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">by {book.author}</p>
                    <p className="text-sm text-gray-500">Posted by {book.posterName}</p>
                    {book.price && (
                      <p className="text-lg font-semibold text-green-600 mt-2">${book.price}</p>
                    )}
                    {book.condition && (
                      <p className="text-sm text-gray-500">Condition: {book.condition}</p>
                    )}
                    {book.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{book.description}</p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleMessageClick(book.id)}
                  className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2 self-start md:self-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChatModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors hover:scale-105 transform z-50"
        title="Open Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Modals */}
      {showBookModal && (
        <BookModal onClose={() => setShowBookModal(false)} />
      )}
      
      {showChatModal && (
        <ChatModal
          onClose={() => setShowChatModal(false)}
          bookId={selectedBookId}
        />
      )}
    </div>
  );
}