export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'faculty';
  department?: string;
  year?: string;
  profilePicture?: string;
  contactInfo?: {
    phone?: string;
    dormRoom?: string;
  };
  academicInterests?: string[];
  rating?: number;
  totalTransactions?: number;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  notifications: {
    messages: boolean;
    events: boolean;
    transactions: boolean;
    announcements: boolean;
    quietHours: { start: string; end: string };
  };
  privacy: {
    profileVisibility: 'public' | 'university' | 'private';
    showContactInfo: boolean;
    showActivity: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  postedBy: string;
  posterName: string;
  images?: string[];
  description?: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  price?: number;
  suggestedPrice?: number;
  type: 'sell' | 'rent' | 'exchange' | 'buy';
  department?: string;
  courseCode?: string;
  location?: string;
  isAvailable: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  date: string;
  time: string;
  endTime?: string;
  duration: string;
  venue: string;
  category: 'Academic' | 'Social' | 'Sports' | 'Tech' | 'Cultural' | 'Other';
  department: string;
  organizer: string;
  organizerId: string;
  bannerImage?: string;
  maxAttendees?: number;
  currentAttendees: number;
  isTicketed: boolean;
  ticketPrice?: number;
  registrationDeadline?: string;
  tags?: string[];
  isApproved: boolean;
  isActive: boolean;
  attendees: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  chatId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  timestamp: Date;
  isRead: boolean;
  senderName: string;
  isEdited?: boolean;
  replyTo?: string;
}

export interface Chat {
  id: string;
  participants: string[];
  participantNames: string[];
  type: 'direct' | 'group';
  bookId?: string;
  eventId?: string;
  bookTitle?: string;
  eventTitle?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: { [userId: string]: number };
  isActive: boolean;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  bookId: string;
  buyerId: string;
  sellerId: string;
  amount?: number;
  type: 'sale' | 'rental' | 'exchange';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingPoint?: string;
  meetingTime?: Date;
  rating?: {
    buyerRating?: number;
    sellerRating?: number;
    buyerReview?: string;
    sellerReview?: string;
  };
  createdAt: Date;
  completedAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'event' | 'transaction' | 'announcement' | 'security';
  title: string;
  content: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  faculty: string;
  courses: Course[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  year: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalBooks: number;
  totalEvents: number;
  totalTransactions: number;
  pendingApprovals: number;
  reportedContent: number;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId?: string;
  reportedBookId?: string;
  reportedEventId?: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}