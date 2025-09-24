import { useState } from 'react';
import { Search, Plus, Calendar, Clock, MapPin, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Event } from '../types';
import EventModal from './EventModal';
import EventDetailsModal from './EventDetailsModal';

export default function Events() {
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'department' | 'category'>('date');
  const { events } = useApp();

  const filteredAndSortedEvents = events
    .filter(event =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'department':
          return a.department.localeCompare(b.department);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    return category === 'Tech'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Campus Events</h1>
            <p className="text-gray-600">Discover and organize campus activities</p>
          </div>
          <button
            onClick={() => setShowEventModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Post an Event</span>
          </button>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events by name, department, or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'department' | 'category')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="department">Sort by Department</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedEvents.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Try adjusting your search criteria'
                : 'Be the first to post an event!'
              }
            </p>
          </div>
        ) : (
          filteredAndSortedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* Event Header */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 mr-2">
                      {event.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{event.department}</p>
                </div>

                {/* Event Details */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{event.time} ({event.duration})</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>

                {/* Description Preview */}
                {event.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                )}

                {/* View Details Button */}
                <button
                  onClick={() => handleViewDetails(event)}
                  className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {showEventModal && (
        <EventModal onClose={() => setShowEventModal(false)} />
      )}
      
      {showDetailsModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}