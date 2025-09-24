import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Book, Event, Message, Chat, Transaction, Notification, AdminStats } from '../types';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface AppContextType {
	// User Management
	user: User | null;
	users: User[];
	login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
	logout: () => void;
	register: (userData: Partial<User>, password: string) => Promise<boolean>;
	updateProfile: (updates: Partial<User>) => Promise<boolean>;
	
	// Books
	books: Book[];
	addBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'isAvailable' | 'postedBy' | 'posterName'>) => Promise<void>;
	updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
	deleteBook: (id: string) => Promise<void>;
	searchBooks: (query: string, filters?: { department?: string; condition?: Book['condition']; type?: Book['type']; priceRange?: [number, number] }) => Book[];
	
	// Events
	events: Event[];
	addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'currentAttendees' | 'attendees' | 'isApproved' | 'organizer' | 'organizerId' | 'isActive'>) => Promise<void>;
	updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
	deleteEvent: (id: string) => Promise<void>;
	rsvpEvent: (eventId: string) => Promise<void>;
	
	// Chat & Messages
	chats: Chat[];
	messages: Message[];
	addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => Promise<void>;
	markMessageAsRead: (messageId: string) => Promise<void>;
	getChat: (bookId?: string, otherUserId?: string, eventId?: string) => Chat | undefined;
	createChat: (participants: string[], type: 'direct' | 'group', bookId?: string, eventId?: string) => Promise<Chat>;
	
	// Transactions
	transactions: Transaction[];
	createTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'status'>) => Promise<void>;
	updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
	
	// Notifications
	notifications: Notification[];
	addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
	markNotificationAsRead: (id: string) => Promise<void>;
	
	// Admin Functions
	adminStats: AdminStats | null;
	pendingUsers: User[];
	reportedContent: { id: string; type: 'book' | 'event' | 'user'; reason: string }[];
	approveUser: (userId: string) => Promise<void>;
	suspendUser: (userId: string, reason: string) => Promise<void>;
	approveEvent: (eventId: string) => Promise<void>;
	
	// Utility
	loading: boolean;
	error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Enhanced sample data
const sampleUsers: User[] = [
  {
    id: 'user1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    role: 'student',
    department: 'Computer Science',
    year: '3rd Year',
    rating: 4.8,
    totalTransactions: 12,
    isVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    preferences: {
      notifications: {
        messages: true,
        events: true,
        transactions: true,
        announcements: true,
        quietHours: { start: '22:00', end: '08:00' }
      },
      privacy: {
        profileVisibility: 'university',
        showContactInfo: true,
        showActivity: true
      },
      theme: 'light',
      language: 'en'
    }
  },
  {
    id: 'user2',
    name: 'Mike Chen',
    email: 'mike.chen@university.edu',
    role: 'student',
    department: 'Electrical Engineering',
    year: '2nd Year',
    rating: 4.6,
    totalTransactions: 8,
    isVerified: true,
    isActive: true,
    createdAt: new Date('2024-02-01'),
    preferences: {
      notifications: {
        messages: true,
        events: false,
        transactions: true,
        announcements: true,
        quietHours: { start: '23:00', end: '07:00' }
      },
      privacy: {
        profileVisibility: 'public',
        showContactInfo: false,
        showActivity: true
      },
      theme: 'dark',
      language: 'en'
    }
  }
];

const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'Data Structures and Algorithms',
    author: 'Robert Lafore',
    isbn: '978-0672324536',
    postedBy: 'user1',
    posterName: 'Sarah Johnson',
    type: 'sell',
    condition: 'Good',
    price: 45,
    suggestedPrice: 50,
    description: 'Excellent condition, barely used. All chapters covered in CS301.',
    department: 'Computer Science',
    courseCode: 'CS301',
    location: 'Main Library',
    isAvailable: true,
    views: 23,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    title: 'Introduction to Machine Learning',
    author: 'Ethem Alpaydin',
    isbn: '978-0262028189',
    postedBy: 'user2',
    posterName: 'Mike Chen',
    type: 'exchange',
    condition: 'Like New',
    description: 'Looking to exchange for a calculus book or linear algebra',
    department: 'Computer Science',
    courseCode: 'CS401',
    location: 'Engineering Building',
    isAvailable: true,
    views: 15,
    createdAt: new Date('2024-12-02'),
    updatedAt: new Date('2024-12-02')
  }
];

const sampleEvents: Event[] = [
  {
    id: '1',
    name: 'Tech Talk: AI in Modern Applications',
    description: 'Join us for an insightful discussion on AI applications in various industries. Guest speakers from top tech companies will share their experiences.',
    date: '2025-01-25',
    time: '14:00',
    endTime: '16:00',
    duration: '2 hours',
    venue: 'Auditorium A, Main Building',
    category: 'Tech',
    department: 'Computer Science',
    organizer: 'CS Club',
    organizerId: 'user1',
    maxAttendees: 200,
    currentAttendees: 45,
    isTicketed: false,
    tags: ['AI', 'Technology', 'Career'],
    isApproved: true,
    isActive: true,
    attendees: ['user1', 'user2'],
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    name: 'Annual Cultural Festival',
    description: 'Celebrate diversity and culture with performances, food stalls, and cultural exhibitions from around the world.',
    date: '2025-02-15',
    time: '10:00',
    endTime: '18:00',
    duration: '8 hours',
    venue: 'Main Campus Ground',
    category: 'Cultural',
    department: 'Student Activities',
    organizer: 'Cultural Committee',
    organizerId: 'user2',
    maxAttendees: 1000,
    currentAttendees: 234,
    isTicketed: true,
    ticketPrice: 10,
    registrationDeadline: '2025-02-10',
    tags: ['Culture', 'Festival', 'Food', 'Performance'],
    isApproved: true,
    isActive: true,
    attendees: ['user1'],
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01')
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [books, setBooks] = useState<Book[]>(sampleBooks);
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin data
  const [adminStats] = useState<AdminStats>({
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    totalBooks: books.length,
    totalEvents: events.length,
    totalTransactions: transactions.length,
    pendingApprovals: 3,
    reportedContent: 1
  });

  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [reportedContent] = useState<{ id: string; type: 'book' | 'event' | 'user'; reason: string }[]>([]);

  // Authentication
  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Example Supabase auth call (replace demo logic when ready)
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      // if (error) throw error;
      // const profile = data.user;
      // Validate university email
      if (!email.endsWith('@university.edu')) {
        throw new Error('Please use your university email address');
      }

      // Simple demo login - in real app, this would call an API
      if (email && password) {
        const foundUser = users.find(u => u.email === email) || {
          id: 'current-user',
          name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email,
          role: email.includes('admin') ? 'admin' as const : 'student' as const,
          department: 'Computer Science',
          year: '3rd Year',
          isVerified: true,
          isActive: true,
          rating: 4.5,
          totalTransactions: 0,
          createdAt: new Date(),
          preferences: {
            notifications: {
              messages: true,
              events: true,
              transactions: true,
              announcements: true,
              quietHours: { start: '22:00', end: '08:00' }
            },
            privacy: {
              profileVisibility: 'university',
              showContactInfo: true,
              showActivity: true
            },
            theme: 'light',
            language: 'en'
          }
        };

        setUser(foundUser);
        
        if (rememberMe) {
          localStorage.setItem('campus_connect_user', JSON.stringify(foundUser));
        }

        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      toast.error(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>, _password: string): Promise<boolean> => {
    void _password;
    setLoading(true);
    setError(null);

    try {
      if (!userData.email?.endsWith('@university.edu')) {
        throw new Error('Please use your university email address');
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'student',
        department: userData.department,
        year: userData.year,
        isVerified: false,
        isActive: false, // Requires admin approval
        rating: 0,
        totalTransactions: 0,
        createdAt: new Date(),
        preferences: {
          notifications: {
            messages: true,
            events: true,
            transactions: true,
            announcements: true,
            quietHours: { start: '22:00', end: '08:00' }
          },
          privacy: {
            profileVisibility: 'university',
            showContactInfo: true,
            showActivity: true
          },
          theme: 'light',
          language: 'en'
        }
      };

      setUsers(prev => [...prev, newUser]);
      setPendingUsers(prev => [...prev, newUser]);
      
      toast.success('Registration successful! Please wait for admin approval.');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      toast.error(err instanceof Error ? err.message : 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campus_connect_user');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      toast.success('Profile updated successfully');
      return true;
    } catch {
      toast.error('Failed to update profile');
      return false;
    }
  };

  // Books
  const addBook = async (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'isAvailable' | 'postedBy' | 'posterName'>) => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      postedBy: user?.id || 'anonymous',
      posterName: user?.name || 'Anonymous',
      isAvailable: true,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setBooks(prev => [newBook, ...prev]);
    toast.success('Book listing posted successfully!');
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, ...updates, updatedAt: new Date() } : book
    ));
    toast.success('Book updated successfully!');
  };

  const deleteBook = async (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
    toast.success('Book listing deleted');
  };

  const searchBooks = (query: string, filters?: { department?: string; condition?: Book['condition']; type?: Book['type']; priceRange?: [number, number] }): Book[] => {
    return books.filter(book => {
      const matchesQuery = query === '' || 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.isbn?.includes(query) ||
        book.courseCode?.toLowerCase().includes(query.toLowerCase());

      const matchesFilters = !filters || (
        (!filters.department || book.department === filters.department) &&
        (!filters.condition || book.condition === filters.condition) &&
        (!filters.type || book.type === filters.type) &&
        (!filters.priceRange || (book.price !== undefined && book.price >= filters.priceRange[0] && book.price <= filters.priceRange[1]))
      );

      return matchesQuery && matchesFilters;
    });
  };

  // Events
  const addEvent = async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'currentAttendees' | 'attendees' | 'isApproved' | 'organizer' | 'organizerId' | 'isActive'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      organizerId: user?.id || 'anonymous',
      organizer: user?.name || 'Anonymous',
      currentAttendees: 0,
      attendees: [],
      isApproved: user?.role === 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setEvents(prev => [newEvent, ...prev]);
    toast.success(user?.role === 'admin' ? 'Event created successfully!' : 'Event submitted for approval');
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updates, updatedAt: new Date() } : event
    ));
    toast.success('Event updated successfully!');
  };

  const deleteEvent = async (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    toast.success('Event deleted');
  };

  const rsvpEvent = async (eventId: string) => {
    if (!user) return;

    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const isAttending = event.attendees.includes(user.id);
        return {
          ...event,
          attendees: isAttending 
            ? event.attendees.filter(id => id !== user.id)
            : [...event.attendees, user.id],
          currentAttendees: isAttending 
            ? event.currentAttendees - 1 
            : event.currentAttendees + 1
        };
      }
      return event;
    }));

    const event = events.find(e => e.id === eventId);
    const isAttending = event?.attendees.includes(user.id);
    toast.success(isAttending ? 'RSVP cancelled' : 'RSVP confirmed!');
  };

  // Chat & Messages
  const addMessage = async (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Update chat with last message
    setChats(prev => prev.map(chat => 
      chat.participants.includes(message.senderId) && chat.participants.includes(message.receiverId)
        ? { ...chat, lastMessage: message.content, lastMessageTime: new Date() }
        : chat
    ));
  };

  const markMessageAsRead = async (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
  };

  const getChat = (bookId?: string, otherUserId?: string, eventId?: string): Chat | undefined => {
    return chats.find(chat => {
      if (bookId && chat.bookId === bookId) {
        return chat.participants.includes(user?.id || '') && chat.participants.includes(otherUserId || '');
      }
      if (eventId && chat.eventId === eventId) {
        return chat.participants.includes(user?.id || '');
      }
      return chat.participants.includes(user?.id || '') && chat.participants.includes(otherUserId || '');
    });
  };

  const createChat = async (participants: string[], type: 'direct' | 'group', bookId?: string, eventId?: string): Promise<Chat> => {
    const book = bookId ? books.find(b => b.id === bookId) : undefined;
    const event = eventId ? events.find(e => e.id === eventId) : undefined;
    
    const newChat: Chat = {
      id: Date.now().toString(),
      participants,
      participantNames: participants.map(id => users.find(u => u.id === id)?.name || 'Unknown'),
      type,
      bookId,
      eventId,
      bookTitle: book?.title,
      eventTitle: event?.name,
      unreadCount: {},
      isActive: true,
      createdAt: new Date()
    };
    
    setChats(prev => [...prev, newChat]);
    return newChat;
  };

  // Transactions
  const createTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'status'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date()
    };
    setTransactions(prev => [...prev, newTransaction]);
    toast.success('Transaction initiated');
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
    toast.success('Transaction updated');
  };

  // Notifications
  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  // Admin Functions
  const approveUser = async (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isActive: true, isVerified: true } : u
    ));
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    toast.success('User approved successfully');
  };

  const suspendUser = async (userId: string, _reason: string) => {
    void _reason;
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isActive: false } : u
    ));
    toast.success('User suspended');
  };

  const approveEvent = async (eventId: string) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, isApproved: true } : e
    ));
    toast.success('Event approved');
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('campus_connect_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('campus_connect_user');
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{
      // User Management
      user,
      users,
      login,
      logout,
      register,
      updateProfile,
      
      // Books
      books,
      addBook,
      updateBook,
      deleteBook,
      searchBooks,
      
      // Events
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      rsvpEvent,
      
      // Chat & Messages
      chats,
      messages,
      addMessage,
      markMessageAsRead,
      getChat,
      createChat,
      
      // Transactions
      transactions,
      createTransaction,
      updateTransaction,
      
      // Notifications
      notifications,
      addNotification,
      markNotificationAsRead,
      
      // Admin Functions
      adminStats,
      pendingUsers,
      reportedContent,
      approveUser,
      suspendUser,
      approveEvent,
      
      // Utility
      loading,
      error
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}