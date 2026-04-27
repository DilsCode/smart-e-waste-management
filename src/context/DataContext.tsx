
import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { User, Role, Bin, Pickup, Payment, Settings, PickupItem, ScanLog, BinIssue, ChatMessage } from '../types';
import { db, auth } from '../firebase';
import { 
  collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, 
  getDocs, writeBatch,
  QuerySnapshot, DocumentSnapshot, FirestoreError
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firestore';
import { USERS, BINS, EWASTE_ITEMS } from '../constants';

interface AppState {
  currentUser: User | null;
  users: User[];
  bins: Bin[];
  pickups: Pickup[];
  payments: Payment[];
  scanLogs: ScanLog[];
  binIssues: BinIssue[];
  messages: ChatMessage[];
  settings: Settings;
  loading: boolean;
  isAuthReady: boolean;
}

const initialState: AppState = {
  currentUser: null,
  users: [],
  bins: [],
  pickups: [],
  payments: [],
  scanLogs: [],
  binIssues: [],
  messages: [],
  settings: {
      collegeName: "EcoConnect Campus",
      adminEmail: "admin@campus.edu",
      itemPrices: EWASTE_ITEMS
  },
  loading: true,
  isAuthReady: false
};

type Action =
  | { type: 'SET_AUTH_USER'; payload: User | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_BINS'; payload: Bin[] }
  | { type: 'SET_PICKUPS'; payload: Pickup[] }
  | { type: 'SET_PAYMENTS'; payload: Payment[] }
  | { type: 'SET_SCAN_LOGS'; payload: ScanLog[] }
  | { type: 'SET_BIN_ISSUES'; payload: BinIssue[] }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTH_READY'; payload: boolean };

const DataContext = createContext<{
  state: AppState;
  login: (email: string, role?: Role, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  completePickup: (payload: { pickupId: string }) => Promise<void>;
  requestPickup: (payload: { binId: string; userId: string | null; notes: string | null; items?: PickupItem[] }) => Promise<void>;
  addBin: (payload: Omit<Bin, 'id'> | Bin) => Promise<void>;
  editBin: (payload: Bin) => Promise<void>;
  deleteBin: (payload: { binId: string }) => Promise<void>;
  addUser: (payload: { name: string; email: string; role: Role }) => Promise<void>;
  editUser: (payload: User) => Promise<void>;
  deleteUser: (payload: { userId: string }) => Promise<void>;
  deletePickup: (payload: { pickupId: string }) => Promise<void>;
  addScanLog: (payload: { binId: string; itemType: string; quantity: number; userId: string; }) => Promise<{ pickupCreated: boolean }>;
  updateSettings: (payload: Settings) => Promise<void>;
  acceptPickup: (payload: { pickupId: string }) => Promise<void>;
  reportIssue: (payload: Omit<BinIssue, 'id' | 'timestamp' | 'status'>) => Promise<void>;
  sendMessage: (payload: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<void>;
  getBinById: (id: string) => Bin | undefined;
  getUserById: (id: string) => User | undefined;
  getRecyclers: () => User[];
  getRecyclerPickups: (recyclerId: string) => Pickup[];
} | undefined>(undefined);

const dataReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_AUTH_USER': return { ...state, currentUser: action.payload };
    case 'SET_USERS': return { ...state, users: action.payload };
    case 'SET_BINS': return { ...state, bins: action.payload };
    case 'SET_PICKUPS': return { ...state, pickups: action.payload };
    case 'SET_PAYMENTS': return { ...state, payments: action.payload };
    case 'SET_SCAN_LOGS': return { ...state, scanLogs: action.payload };
    case 'SET_BIN_ISSUES': return { ...state, binIssues: action.payload };
    case 'SET_MESSAGES': return { ...state, messages: action.payload };
    case 'SET_SETTINGS': return { ...state, settings: action.payload };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_AUTH_READY': return { ...state, isAuthReady: action.payload };
    default: return state;
  }
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Sign in anonymously on mount to get a UID for Firestore listeners
        // If this fails, we continue anyway as rules might be public or user might login later
        try {
          if (!auth.currentUser) {
            await signInAnonymously(auth);
            console.log(`[Auth] Initial anonymous sign-in successful: ${(auth.currentUser as any)?.uid}`);
          }
        } catch (authErr) {
          console.warn("[Auth] Anonymous sign-in not available. Continuing with public access if allowed by rules.");
        }
        
        const savedUser = localStorage.getItem('eco_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          dispatch({ type: 'SET_AUTH_USER', payload: parsedUser });
        }
      } catch (err) {
        // Main init error
      } finally {
        dispatch({ type: 'SET_AUTH_READY', payload: true });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    initAuth();
  }, []);

  useEffect(() => {
    const unsubscribers = [
      onSnapshot(collection(db, 'users'), (snap: QuerySnapshot) => {
        const users = snap.docs.map(d => d.data() as User);
        dispatch({ type: 'SET_USERS', payload: users });
        
        // Sync current user if role changed in DB
        const savedUser = localStorage.getItem('eco_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          const updated = users.find(u => u.id === parsed.id);
          if (updated && JSON.stringify(updated) !== savedUser) {
            localStorage.setItem('eco_user', JSON.stringify(updated));
            dispatch({ type: 'SET_AUTH_USER', payload: updated });
          }
        }
      }, (err: FirestoreError) => handleFirestoreError(err, OperationType.LIST, 'users')),

      onSnapshot(collection(db, 'bins'), (snap: QuerySnapshot) => {
        dispatch({ type: 'SET_BINS', payload: snap.docs.map(d => d.data() as Bin) });
      }, (err: FirestoreError) => handleFirestoreError(err, OperationType.LIST, 'bins')),

      onSnapshot(collection(db, 'pickups'), (snap: QuerySnapshot) => {
        dispatch({ type: 'SET_PICKUPS', payload: snap.docs.map(d => d.data() as Pickup) });
      }, (err: FirestoreError) => handleFirestoreError(err, OperationType.LIST, 'pickups')),

      onSnapshot(collection(db, 'payments'), (snap: QuerySnapshot) => {
        dispatch({ type: 'SET_PAYMENTS', payload: snap.docs.map(d => d.data() as Payment) });
      }, (err: FirestoreError) => handleFirestoreError(err, OperationType.LIST, 'payments')),

      onSnapshot(collection(db, 'scanLogs'), (snap: QuerySnapshot) => {
        dispatch({ type: 'SET_SCAN_LOGS', payload: snap.docs.map(d => d.data() as ScanLog) });
      }, (err: FirestoreError) => handleFirestoreError(err, OperationType.LIST, 'scanLogs')),

      onSnapshot(collection(db, 'binIssues'), (snap: QuerySnapshot) => {
        dispatch({ type: 'SET_BIN_ISSUES', payload: snap.docs.map(d => d.data() as BinIssue) });
      }, (err: FirestoreError) => handleFirestoreError(err, OperationType.LIST, 'binIssues')),

      onSnapshot(collection(db, 'messages'), (snap: QuerySnapshot) => {
        dispatch({ type: 'SET_MESSAGES', payload: snap.docs.map(d => d.data() as ChatMessage) });
      }, (err: FirestoreError) => handleFirestoreError(err, OperationType.LIST, 'messages')),

      onSnapshot(doc(db, 'settings', 'config'), (snap: DocumentSnapshot) => {
        if (snap.exists()) {
          dispatch({ type: 'SET_SETTINGS', payload: snap.data() as Settings });
        }
      }, (err: FirestoreError) => handleFirestoreError(err, OperationType.GET, 'settings/config'))
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, [state.isAuthReady]);

  // --- Initial Data Seeding ---
  useEffect(() => {
    const seedData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        if (usersSnap.empty) {
          const batch = writeBatch(db);
          
          // Seed Users
          USERS.forEach(user => {
            const userRef = doc(db, 'users', user.id.toString());
            batch.set(userRef, { ...user, id: user.id.toString() });
          });

          // Seed Bins
          BINS.forEach(bin => {
            const binRef = doc(db, 'bins', bin.id.toString());
            batch.set(binRef, { ...bin, id: bin.id.toString(), assigned_recycler_id: bin.assigned_recycler_id.toString() });
          });

          // Seed Settings
          const settingsRef = doc(db, 'settings', 'config');
          batch.set(settingsRef, initialState.settings);

          // Seed some initial messages
          const welcomeMessageId = Math.random().toString(36).substr(2, 9);
          batch.set(doc(db, 'messages', welcomeMessageId), {
            id: welcomeMessageId,
            pickup_id: 'general_coordination',
            sender_id: 'system',
            content: 'This is the General Campus Coordination channel. Use this for general queries or scheduling updates.',
            timestamp: new Date().toISOString()
          });

          // Seed a sample previous chat
          const sampleMsg1 = Math.random().toString(36).substr(2, 9);
          const sampleMsg2 = Math.random().toString(36).substr(2, 9);
          
          batch.set(doc(db, 'messages', sampleMsg1), {
            id: sampleMsg1,
            pickup_id: 'general_coordination',
            sender_id: 'recycler_1',
            sender_role: 'recycler',
            content: 'Hello, I will be arriving at 2 PM today for the library pickup.',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          });

          batch.set(doc(db, 'messages', sampleMsg2), {
            id: sampleMsg2,
            pickup_id: 'general_coordination',
            sender_id: 'staff_1',
            sender_role: 'staff',
            content: 'Great, the bins are ready at the south entrance.',
            timestamp: new Date(Date.now() - 1800000).toISOString()
          });
          
          await batch.commit();
          console.log("Seeding completed successfully.");
        }
      } catch (err) {
        console.error("Seeding failed:", err);
      }
    };
    if (state.isAuthReady) {
      seedData();
    }
  }, [state.isAuthReady, state.currentUser]);

  // --- Action Handlers ---

  const login = async (email: string, role?: Role, name?: string) => {
    console.log(`[Login] Attempting login for: ${email} with role: ${role} and name: ${name}`);
    try {
      // 1. Find the user in our local state/constants
      let user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      }

      // 2. If role is explicitly provided from the Login UI, we should respect it
      // This allows users to test different roles with the same email or override existing roles
      if (role) {
        if (user) {
          // If user exists, we "assume" they are logging into the selected section
          user = { ...user, role: role };
          if (name) user.name = name;
        } else {
          // Create a temporary user with the selected role
          user = {
            id: `temp_${Date.now()}`,
            name: name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
            email: email,
            role: role
          };
        }
      }

      if (user) {
        console.log(`[Login] Logging in as:`, user);
        
        // Update last login in Firestore if possible (only for existing users)
        if (!user.id.startsWith('temp_')) {
          try {
            await updateDoc(doc(db, 'users', user.id.toString()), {
              last_login: new Date().toISOString(),
              role: user.role,
              name: user.name
            });
          } catch (e) {
            console.warn("[Login] Could not update user in Firestore", e);
          }
        }

        localStorage.setItem('eco_user', JSON.stringify(user));
        dispatch({ type: 'SET_AUTH_USER', payload: user });
      } else {
        throw new Error("User not found. Please select a role or use a registered email.");
      }
    } catch (err) {
      console.error("[Login] Failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('eco_user');
      dispatch({ type: 'SET_AUTH_USER', payload: null });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const completePickup = async ({ pickupId }: { pickupId: string }) => {
    try {
      const pickup = state.pickups.find(p => p.id === pickupId);
      if (!pickup) return;

      const batch = writeBatch(db);
      
      // Update Pickup
      batch.update(doc(db, 'pickups', pickupId), {
        status: 'completed',
        completed_at: new Date().toISOString()
      });

      // Update Bin
      batch.update(doc(db, 'bins', pickup.bin_id), {
        status: 'active',
        current_count: 0,
        last_updated: new Date().toISOString()
      });

      // Create Payment
      const paymentId = Math.random().toString(36).substr(2, 9);
      batch.set(doc(db, 'payments', paymentId), {
        id: paymentId,
        pickup_id: pickupId,
        recycler_id: pickup.recycler_id,
        amount: pickup.estimated_payment,
        weight: pickup.estimated_weight,
        status: 'pending',
        timestamp: new Date().toISOString(),
        paid_at: new Date().toISOString()
      });

      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `pickups/${pickupId}`);
    }
  };

  const requestPickup = async ({ binId, userId, notes, items }: { binId: string; userId: string | null; notes: string | null; items?: PickupItem[] }) => {
    try {
      const bin = state.bins.find(b => b.id === binId);
      if (!bin || bin.status === 'awaiting-pickup') return;

      const pickupId = Math.random().toString(36).substr(2, 9);
      
      let estimatedWeight = 0;
      let estimatedPayment = 0;
      
      if (items) {
        for (const item of items) {
          const itemDetails = state.settings.itemPrices.find(p => p.type === item.type);
          if (itemDetails) {
            const itemTotalWeight = itemDetails.weight_kg * item.quantity;
            estimatedWeight += itemTotalWeight;
            estimatedPayment += itemTotalWeight * itemDetails.price_per_kg;
          }
        }
      } else {
        const AVG_ITEM_WEIGHT_KG = 0.8;
        const AVG_PRICE_PER_KG = 2.0;
        estimatedWeight = bin.capacity * AVG_ITEM_WEIGHT_KG;
        estimatedPayment = estimatedWeight * AVG_PRICE_PER_KG;
      }

      const newPickup: Pickup = {
        id: pickupId,
        bin_id: binId,
        recycler_id: bin.assigned_recycler_id,
        request_time: new Date().toISOString(),
        estimated_weight: estimatedWeight,
        estimated_payment: estimatedPayment,
        status: 'pending',
        completed_at: null,
        requester_id: userId,
        notes: notes,
        items: items || []
      };

      const batch = writeBatch(db);
      batch.set(doc(db, 'pickups', pickupId), newPickup);
      batch.update(doc(db, 'bins', binId), {
        status: 'awaiting-pickup',
        last_updated: new Date().toISOString()
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `pickups`);
    }
  };

  const addBin = async (binData: Omit<Bin, 'id'> | Bin) => {
    try {
      const id = 'id' in binData ? binData.id : Math.random().toString(36).substr(2, 9);
      const newBin: Bin = {
        ...binData,
        id,
        current_count: 'current_count' in binData ? binData.current_count : 0,
        qr_code: 'qr_code' in binData ? binData.qr_code : `BIN-${id.toUpperCase()}`,
        status: 'status' in binData ? binData.status : 'active',
        last_updated: new Date().toISOString()
      };
      await setDoc(doc(db, 'bins', id), newBin);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'bins');
    }
  };

  const editBin = async (bin: Bin) => {
    try {
      await updateDoc(doc(db, 'bins', bin.id), { ...bin, last_updated: new Date().toISOString() });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `bins/${bin.id}`);
    }
  };

  const deleteBin = async ({ binId }: { binId: string }) => {
    try {
      await deleteDoc(doc(db, 'bins', binId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `bins/${binId}`);
    }
  };

  const addUser = async (payload: { name: string; email: string; role: Role }) => {
    try {
      const id = Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, 'users', id), { id, ...payload });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'users');
    }
  };

  const editUser = async (user: User) => {
    try {
      await updateDoc(doc(db, 'users', user.id), { ...user });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.id}`);
    }
  };

  const deleteUser = async ({ userId }: { userId: string }) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${userId}`);
    }
  };

  const deletePickup = async ({ pickupId }: { pickupId: string }) => {
    try {
      await deleteDoc(doc(db, 'pickups', pickupId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `pickups/${pickupId}`);
    }
  };

  const addScanLog = async (payload: { binId: string; itemType: string; quantity: number; userId: string; }) => {
    try {
      const bin = state.bins.find(b => b.id === payload.binId);
      if (!bin) return { pickupCreated: false };

      const logId = Math.random().toString(36).substr(2, 9);
      const newCount = bin.current_count + payload.quantity;
      const isNowFull = newCount >= bin.capacity;
      const pickupCreated = isNowFull && bin.status !== 'awaiting-pickup';

      const itemDetails = state.settings.itemPrices.find(p => p.type === payload.itemType);
      const weight = itemDetails ? itemDetails.weight_kg * payload.quantity : payload.quantity * 0.5;

      const batch = writeBatch(db);
      
      // Add Log
      batch.set(doc(db, 'scanLogs', logId), {
        id: logId,
        bin_id: payload.binId,
        staff_id: payload.userId,
        items: [{
          type: payload.itemType,
          quantity: payload.quantity,
          weight: weight
        }],
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

      // Update Bin
      batch.update(doc(db, 'bins', payload.binId), {
        current_count: Math.min(newCount, bin.capacity),
        status: isNowFull ? 'awaiting-pickup' : bin.status,
        last_updated: new Date().toISOString()
      });

      // Auto-trigger pickup if full
      if (pickupCreated) {
        const pickupId = Math.random().toString(36).substr(2, 9);
        const AVG_ITEM_WEIGHT_KG = itemDetails?.weight_kg || 0.8;
        const AVG_PRICE_PER_KG = itemDetails?.price_per_kg || 2.0;
        const estimatedWeight = bin.capacity * AVG_ITEM_WEIGHT_KG;
        const estimatedPayment = estimatedWeight * AVG_PRICE_PER_KG;

        batch.set(doc(db, 'pickups', pickupId), {
          id: pickupId,
          bin_id: payload.binId,
          recycler_id: bin.assigned_recycler_id,
          request_time: new Date().toISOString(),
          estimated_weight: estimatedWeight,
          estimated_payment: estimatedPayment,
          status: 'pending',
          completed_at: null,
          requester_id: payload.userId,
          notes: 'Bin full, auto-pickup requested.',
          items: []
        });
      }

      await batch.commit();
      return { pickupCreated };
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'scanLogs');
      return { pickupCreated: false };
    }
  };

  const updateSettings = async (payload: Settings) => {
    try {
      await setDoc(doc(db, 'settings', 'config'), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/config');
    }
  };

  const acceptPickup = async ({ pickupId }: { pickupId: string }) => {
    try {
      await updateDoc(doc(db, 'pickups', pickupId), {
        status: 'accepted'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `pickups/${pickupId}`);
    }
  };

  const reportIssue = async (payload: Omit<BinIssue, 'id' | 'timestamp' | 'status'>) => {
    try {
      const id = Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, 'binIssues', id), {
        ...payload,
        id,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'binIssues');
    }
  };

  const sendMessage = async (payload: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    try {
      const id = Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, 'messages', id), {
        ...payload,
        id,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'messages');
    }
  };

  const getBinById = useCallback((id: string) => state.bins.find(b => b.id === id), [state.bins]);
  const getUserById = useCallback((id: string) => state.users.find(u => u.id === id), [state.users]);
  const getRecyclers = useCallback(() => state.users.filter(u => u.role === Role.Recycler), [state.users]);
  const getRecyclerPickups = useCallback((recyclerId: string) => state.pickups.filter(p => p.recycler_id === recyclerId), [state.pickups]);

  const value = { state, login, logout, completePickup, requestPickup, addBin, editBin, deleteBin, addUser, editUser, deleteUser, deletePickup, addScanLog, updateSettings, acceptPickup, reportIssue, sendMessage, getBinById, getUserById, getRecyclers, getRecyclerPickups };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};
