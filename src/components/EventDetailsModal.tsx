import { X, Calendar, Clock, MapPin, User } from 'lucide-react';
import { Event } from '../types';

interface EventDetailsModalProps {
  event: Event;
  onClose: () => void;
}

export default function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    return category === 'Tech'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-green-100 text-green-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900">Event Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Event Header */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-2xl font-bold text-gray-900 flex-1 mr-4">{event.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
            </div>
            <p className="text-gray-600">{event.department}</p>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Time & Duration</p>
                  <p className="font-medium text-gray-900">{event.time} ({event.duration})</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Venue</p>
                  <p className="font-medium text-gray-900">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Organizer</p>
                  <p className="font-medium text-gray-900">{event.organizer}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}