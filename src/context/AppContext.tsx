import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
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
	authInitialized: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Enhanced sample data (kept for reference during development)
/* const sampleUsers: User[] = [
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
]; */

/* const sampleBooks: Book[] = [
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
]; */

/* const sampleEvents: Event[] = [
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
]; */

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [reportedContent] = useState<{ id: string; type: 'book' | 'event' | 'user'; reason: string }[]>([]);

  // Admin data (derived live from current state)
  const adminStats: AdminStats = useMemo(() => ({
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    totalBooks: books.length,
    totalEvents: events.length,
    totalTransactions: transactions.length,
    pendingApprovals: pendingUsers.length,
    reportedContent: reportedContent.length
  }), [users, books, events, transactions, pendingUsers, reportedContent]);

  // Authentication
  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const authUser = data.user;

      // Load or create profile row
      const { data: profileRows, error: profileErr } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .limit(1);
      if (profileErr) throw profileErr;

      let profile = profileRows?.[0];
      if (!profile) {
        const name = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
        const { data: inserted, error: insErr } = await supabase
          .from('users')
          .insert({ auth_user_id: authUser?.id, name, email, role: 'student', is_verified: true, is_active: true })
          .select('*')
          .single();
        if (insErr) throw insErr;
        profile = inserted;
      }

      const mapped: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        department: profile.department ?? undefined,
        year: profile.year ?? undefined,
        isVerified: profile.is_verified,
        isActive: profile.is_active,
        rating: Number(profile.rating ?? 0),
        totalTransactions: Number(profile.total_transactions ?? 0),
        createdAt: new Date(profile.created_at),
        preferences: undefined
      };

      setUser(mapped);
      if (rememberMe) localStorage.setItem('campus_connect_user', JSON.stringify(mapped));
      toast.success(`Welcome back, ${mapped.name}!`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      toast.error(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      if (!userData.email?.endsWith('@university.edu')) {
        throw new Error('Please use your university email address');
      }
      const { data, error } = await supabase.auth.signUp({ email: userData.email!, password });
      if (error) throw error;
      const authUser = data.user;

      const { error: insErr } = await supabase.from('users').insert({
        auth_user_id: authUser?.id,
        name: userData.name || userData.email!.split('@')[0],
        email: userData.email!,
        role: userData.role || 'student',
        is_verified: false,
        is_active: false
      });
      if (insErr) throw insErr;

      toast.success('Registration successful! Please check your email to verify your account.');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      toast.error(err instanceof Error ? err.message : 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
    if (!user) throw new Error('Not authenticated');
    const payload = {
      title: book.title,
      author: book.author,
      isbn: book.isbn ?? null,
      posted_by: user.id,
      poster_name: user.name,
      images: null,
      description: book.description ?? null,
      condition: book.condition,
      price: book.price ?? null,
      suggested_price: book.suggestedPrice ?? null,
      type: book.type,
      department: book.department ?? null,
      course_code: book.courseCode ?? null,
      location: book.location ?? null
    };
    const { data, error } = await supabase.from('books').insert(payload).select('*').single();
    if (error) throw error;
    const mapped: Book = {
      id: data.id,
      title: data.title,
      author: data.author,
      isbn: data.isbn ?? undefined,
      postedBy: data.posted_by,
      posterName: data.poster_name,
      images: data.images ?? undefined,
      description: data.description ?? undefined,
      condition: data.condition,
      price: data.price ?? undefined,
      suggestedPrice: data.suggested_price ?? undefined,
      type: data.type,
      department: data.department ?? undefined,
      courseCode: data.course_code ?? undefined,
      location: data.location ?? undefined,
      isAvailable: data.is_available,
      views: data.views,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
    setBooks(prev => [mapped, ...prev]);
    toast.success('Book listing posted successfully!');
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.author !== undefined) payload.author = updates.author;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.condition !== undefined) payload.condition = updates.condition;
    if (updates.price !== undefined) payload.price = updates.price;
    if (updates.type !== undefined) payload.type = updates.type;
    const { data, error } = await supabase.from('books').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    setBooks(prev => prev.map(book => book.id === id ? { ...book, ...updates, updatedAt: new Date(data.updated_at) } : book));
    toast.success('Book updated successfully!');
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) throw error;
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
    if (!user) throw new Error('Not authenticated');
    const payload = {
      name: event.name,
      description: event.description ?? null,
      date: event.date,
      time: event.time,
      end_time: event.endTime ?? null,
      duration: event.duration,
      venue: event.venue,
      category: event.category,
      department: event.department,
      organizer: user.name,
      organizer_id: user.id,
      is_ticketed: event.isTicketed ?? false
    };
    const { data, error } = await supabase.from('events').insert(payload).select('*').single();
    if (error) throw error;
    const mapped: Event = {
      id: data.id,
      name: data.name,
      description: data.description ?? undefined,
      date: data.date,
      time: data.time,
      endTime: data.end_time ?? undefined,
      duration: data.duration,
      venue: data.venue,
      category: data.category,
      department: data.department,
      organizer: data.organizer,
      organizerId: data.organizer_id,
      maxAttendees: data.max_attendees ?? undefined,
      currentAttendees: data.current_attendees,
      isTicketed: data.is_ticketed,
      ticketPrice: data.ticket_price ?? undefined,
      registrationDeadline: data.registration_deadline ?? undefined,
      tags: data.tags ?? undefined,
      isApproved: data.is_approved,
      isActive: data.is_active,
      attendees: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
    setEvents(prev => [mapped, ...prev]);
    toast.success(user.role === 'admin' ? 'Event created successfully!' : 'Event submitted for approval');
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.date !== undefined) payload.date = updates.date;
    if (updates.time !== undefined) payload.time = updates.time;
    if (updates.venue !== undefined) payload.venue = updates.venue;
    const { data, error } = await supabase.from('events').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, ...updates, updatedAt: new Date(data.updated_at) } : ev));
    toast.success('Event updated successfully!');
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
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
    const { data, error } = await supabase.from('messages').insert({
      chat_id: message.chatId,
      sender_id: message.senderId,
      receiver_id: message.receiverId ?? null,
      content: message.content,
      type: message.type,
      sender_name: message.senderName
    }).select('*').single();
    if (error) throw error;

    const mapped: Message = {
      id: data.id,
      chatId: data.chat_id,
      senderId: data.sender_id,
      receiverId: data.receiver_id ?? '',
      content: data.content,
      type: data.type,
      fileUrl: data.file_url ?? undefined,
      fileName: data.file_name ?? undefined,
      timestamp: new Date(data.timestamp),
      isRead: data.is_read,
      senderName: data.sender_name,
      isEdited: data.is_edited ?? false,
      replyTo: data.reply_to ?? undefined
    };
    setMessages(prev => [...prev, mapped]);
    await supabase.from('chats').update({ last_message: data.content, last_message_time: data.timestamp }).eq('id', data.chat_id);
    setChats(prev => prev.map(c => c.id === data.chat_id ? { ...c, lastMessage: data.content, lastMessageTime: new Date(data.timestamp) } : c));
  };

  const markMessageAsRead = async (messageId: string) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', messageId);
    setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, isRead: true } : msg));
  };

  const getChat = (bookId?: string, otherUserId?: string, eventId?: string): Chat | undefined => {
    return chats.find(chat => {
      if (bookId && chat.bookId === bookId) {
        return chat.participants.includes(user?.id || '') && (otherUserId ? chat.participants.includes(otherUserId) : true);
      }
      if (eventId && chat.eventId === eventId) {
        return chat.participants.includes(user?.id || '');
      }
      return chat.participants.includes(user?.id || '') && (otherUserId ? chat.participants.includes(otherUserId) : true);
    });
  };

  const createChat = async (participants: string[], type: 'direct' | 'group', bookId?: string, eventId?: string): Promise<Chat> => {
    const { data: chatRow, error } = await supabase.from('chats').insert({
      type,
      book_id: bookId ?? null,
      event_id: eventId ?? null,
      is_active: true
    }).select('*').single();
    if (error) throw error;

    // Insert participants
    const participantRecords = participants.map(pid => ({ chat_id: chatRow.id, user_id: pid }));
    const { error: partErr } = await supabase.from('chat_participants').insert(participantRecords);
    if (partErr) throw partErr;

    // Resolve names locally if available
    const participantNames = participants.map(id => users.find(u => u.id === id)?.name || 'Unknown');
    const book = bookId ? books.find(b => b.id === bookId) : undefined;
    const event = eventId ? events.find(e => e.id === eventId) : undefined;

    const mapped: Chat = {
      id: chatRow.id,
      participants,
      participantNames,
      type,
      bookId,
      eventId,
      bookTitle: book?.title,
      eventTitle: event?.name,
      lastMessage: chatRow.last_message ?? undefined,
      lastMessageTime: chatRow.last_message_time ? new Date(chatRow.last_message_time) : undefined,
      unreadCount: {},
      isActive: chatRow.is_active,
      createdAt: new Date(chatRow.created_at)
    };
    setChats(prev => [...prev, mapped]);
    return mapped;
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

    // Initialize current session and listen for changes
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session?.user) {
        const { data: profileRows } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .limit(1);
        const profile = profileRows?.[0];
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            department: profile.department ?? undefined,
            year: profile.year ?? undefined,
            isVerified: profile.is_verified,
            isActive: profile.is_active,
            rating: Number(profile.rating ?? 0),
            totalTransactions: Number(profile.total_transactions ?? 0),
            createdAt: new Date(profile.created_at),
            preferences: undefined
          });
        }
      }
      const { data: sub } = supabase.auth.onAuthStateChange(async (_event, sess) => {
        if (sess?.user) {
          const { data: rows } = await supabase
            .from('users')
            .select('*')
            .eq('auth_user_id', sess.user.id)
            .limit(1);
          const prof = rows?.[0];
          if (prof) {
            const mapped: User = {
              id: prof.id,
              name: prof.name,
              email: prof.email,
              role: prof.role,
              department: prof.department ?? undefined,
              year: prof.year ?? undefined,
              isVerified: prof.is_verified,
              isActive: prof.is_active,
              rating: Number(prof.rating ?? 0),
              totalTransactions: Number(prof.total_transactions ?? 0),
              createdAt: new Date(prof.created_at),
              preferences: undefined
            };
            setUser(mapped);
          }
        } else {
          setUser(null);
        }
        setAuthInitialized(true);
      });
      setAuthInitialized(true);
      return () => {
        sub.subscription.unsubscribe();
      };
    })();

    // Load initial data
    (async () => {
      const { data: bookRows } = await supabase.from('books').select('*').order('created_at', { ascending: false });
      if (bookRows) {
        setBooks(bookRows.map((b: any) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          isbn: b.isbn ?? undefined,
          postedBy: b.posted_by,
          posterName: b.poster_name,
          images: b.images ?? undefined,
          description: b.description ?? undefined,
          condition: b.condition,
          price: b.price ?? undefined,
          suggestedPrice: b.suggested_price ?? undefined,
          type: b.type,
          department: b.department ?? undefined,
          courseCode: b.course_code ?? undefined,
          location: b.location ?? undefined,
          isAvailable: b.is_available,
          views: b.views,
          createdAt: new Date(b.created_at),
          updatedAt: new Date(b.updated_at)
        })));
      }

      const { data: eventRows } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      if (eventRows) {
        setEvents(eventRows.map((e: any) => ({
          id: e.id,
          name: e.name,
          description: e.description ?? undefined,
          date: e.date,
          time: e.time,
          endTime: e.end_time ?? undefined,
          duration: e.duration,
          venue: e.venue,
          category: e.category,
          department: e.department,
          organizer: e.organizer,
          organizerId: e.organizer_id,
          maxAttendees: e.max_attendees ?? undefined,
          currentAttendees: e.current_attendees,
          isTicketed: e.is_ticketed,
          ticketPrice: e.ticket_price ?? undefined,
          registrationDeadline: e.registration_deadline ?? undefined,
          tags: e.tags ?? undefined,
          isApproved: e.is_approved,
          isActive: e.is_active,
          attendees: [],
          createdAt: new Date(e.created_at),
          updatedAt: new Date(e.updated_at)
        })));
      }
      // Load chats
      const { data: chatRows } = await supabase.from('chats').select('*').order('created_at', { ascending: false });
      if (chatRows) {
        // fetch participants
        const { data: cps } = await supabase.from('chat_participants').select('*');
        const mapChat = (c: any): Chat => {
          const participants = (cps || []).filter((p: any) => p.chat_id === c.id).map((p: any) => p.user_id);
          const participantNames = participants.map((id: string) => users.find(u => u.id === id)?.name || 'Unknown');
          return {
            id: c.id,
            participants,
            participantNames,
            type: c.type,
            bookId: c.book_id ?? undefined,
            eventId: c.event_id ?? undefined,
            bookTitle: undefined,
            eventTitle: undefined,
            lastMessage: c.last_message ?? undefined,
            lastMessageTime: c.last_message_time ? new Date(c.last_message_time) : undefined,
            unreadCount: {},
            isActive: c.is_active,
            createdAt: new Date(c.created_at)
          };
        };
        setChats(chatRows.map(mapChat));
      }

      // Load messages (optional: scope per chat later)
      const { data: msgRows } = await supabase.from('messages').select('*').order('timestamp', { ascending: true });
      if (msgRows) {
        setMessages(msgRows.map((m: any) => ({
          id: m.id,
          chatId: m.chat_id,
          senderId: m.sender_id,
          receiverId: m.receiver_id ?? '',
          content: m.content,
          type: m.type,
          fileUrl: m.file_url ?? undefined,
          fileName: m.file_name ?? undefined,
          timestamp: new Date(m.timestamp),
          isRead: m.is_read,
          senderName: m.sender_name,
          isEdited: m.is_edited ?? false,
          replyTo: m.reply_to ?? undefined
        })));
      }
    })();
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
      error,
      authInitialized
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