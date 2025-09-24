import { useState } from 'react';
import { 
  Users, BookOpen, Calendar, TrendingUp, AlertTriangle,
  CheckCircle, XCircle, Eye, Ban, UserCheck, Clock, BarChart3,
  Search, Filter, Download, RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    adminStats, 
    users, 
    books, 
    events, 
    pendingUsers, 
    reportedContent,
    approveUser, 
    suspendUser, 
    approveEvent 
  } = useApp();

  type TabId = 'overview' | 'users' | 'content' | 'reports';
  interface TabItem {
    id: TabId;
    name: string;
    icon: (props: { className?: string }) => JSX.Element;
  }

  const tabs: TabItem[] = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'content', name: 'Content Moderation', icon: BookOpen },
    { id: 'reports', name: 'Reports & Analytics', icon: TrendingUp }
  ];

  interface StatCardProps {
    title: string;
    value: number;
    icon: (props: { className?: string }) => JSX.Element;
    color: string;
    change?: number;
  }
  const StatCard = ({ title, value, icon: Icon, color, change }: StatCardProps) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={adminStats?.totalUsers || 0}
          icon={Users}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="Active Users"
          value={adminStats?.activeUsers || 0}
          icon={UserCheck}
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="Book Listings"
          value={adminStats?.totalBooks || 0}
          icon={BookOpen}
          color="bg-purple-500"
          change={-3}
        />
        <StatCard
          title="Events"
          value={adminStats?.totalEvents || 0}
          icon={Calendar}
          color="bg-orange-500"
          change={15}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Pending Approvals</p>
                <p className="text-sm text-yellow-600">{pendingUsers.length} users waiting</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('users')}
              className="mt-3 text-sm text-yellow-700 hover:text-yellow-800 font-medium"
            >
              Review Now →
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Reported Content</p>
                <p className="text-sm text-red-600">{reportedContent.length} items to review</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('content')}
              className="mt-3 text-sm text-red-700 hover:text-red-800 font-medium"
            >
              Review Now →
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">System Health</p>
                <p className="text-sm text-blue-600">All systems operational</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('reports')}
              className="mt-3 text-sm text-blue-700 hover:text-blue-800 font-medium"
            >
              View Details →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <UserCheck className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New user registered</p>
              <p className="text-xs text-gray-500">john.doe@university.edu - 2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New book listing posted</p>
              <p className="text-xs text-gray-500">"Advanced Calculus" - 15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Event created</p>
              <p className="text-xs text-gray-500">"Study Group Session" - 1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Users */}
      {pendingUsers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span>Pending Approvals ({pendingUsers.length})</span>
          </h3>
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.department} • {user.year}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => approveUser(user.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => suspendUser(user.id, 'Registration denied')}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Deny</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Users */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'faculty' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.department}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-600 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => suspendUser(user.id, 'Admin action')}
                        className="p-1 text-gray-600 hover:text-red-600"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContentModeration = () => (
    <div className="space-y-6">
      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Books"
          value={books.length}
          icon={BookOpen}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Events"
          value={events.length}
          icon={Calendar}
          color="bg-green-500"
        />
        <StatCard
          title="Reported Items"
          value={reportedContent.length}
          icon={AlertTriangle}
          color="bg-red-500"
        />
      </div>

      {/* Recent Books */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Book Listings</h3>
        <div className="space-y-3">
          {books.slice(0, 5).map((book) => (
            <div key={book.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{book.title}</p>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                  <p className="text-xs text-gray-500">Posted by {book.posterName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  book.type === 'sell' ? 'bg-green-100 text-green-800' :
                  book.type === 'buy' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {book.type}
                </span>
                <button className="p-1 text-gray-600 hover:text-blue-600">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
        <div className="space-y-3">
          {events.slice(0, 5).map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{event.name}</p>
                  <p className="text-sm text-gray-600">{event.department}</p>
                  <p className="text-xs text-gray-500">{event.date} at {event.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.isApproved ? 'Approved' : 'Pending'}
                </span>
                {!event.isApproved && (
                  <button
                    onClick={() => approveEvent(event.id)}
                    className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
                <button className="p-1 text-gray-600 hover:text-blue-600">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">User Activity</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Daily Active Users</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Weekly Active Users</span>
                <span className="font-medium">5,678</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Active Users</span>
                <span className="font-medium">12,345</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Content Statistics</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Books Posted This Week</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Events Created This Week</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Messages Sent Today</span>
                <span className="font-medium">2,341</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <span>Admin Panel</span>
            </h1>
            <p className="text-gray-600 mt-2">Manage users, content, and system settings</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
        <nav className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && renderUserManagement()}
      {activeTab === 'content' && renderContentModeration()}
      {activeTab === 'reports' && renderReports()}
    </div>
  );
}