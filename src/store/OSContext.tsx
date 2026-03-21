import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

export type World = 'lota' | 'cucu' | 'corp' | 'pse';
export type Tab = 'focus' | 'timeline' | 'habits' | 'finance' | 'sales';
export type MobileView = 'tasks' | 'dashboard' | 'capture';

export interface FocusItem {
  id: number;
  text: string;
  color: string;
  done: boolean;
}

export interface VisionMilestone {
  id: string;
  text: string;
  world: World | 'system';
  completed: boolean;
}

const DEFAULT_FOCUS_ITEMS: FocusItem[] = [
  { id: 1, text: 'Cucufate: open studio fund account', color: 'bg-cucu', done: false },
  { id: 2, text: 'CL: review showroom floor plan v3', color: 'bg-corp', done: true },
  { id: 3, text: 'Lota Kopi: test egg waffle variation', color: 'bg-lota', done: false },
  { id: 4, text: 'Dione OS: define 3 PWA modules', color: 'bg-gold', done: false },
  { id: 5, text: 'Health: 7k steps + 20 min reading', color: 'bg-ink-3', done: false },
];

const DEFAULT_MILESTONES: VisionMilestone[] = [
  { id: '1', text: 'Lota Kopi · manifesto written', world: 'lota', completed: true },
  { id: '2', text: 'Lota Kopi · brand book complete', world: 'lota', completed: true },
  { id: '3', text: 'Cucufate · manifesto written', world: 'cucu', completed: true },
  { id: '4', text: 'Dione OS · v2 unified dashboard', world: 'system', completed: true },
  { id: '5', text: 'Cucufate · 2nd location scouted', world: 'cucu', completed: false },
  { id: '6', text: 'CL · portfolio case study published', world: 'corp', completed: false },
  { id: '7', text: 'Dione OS · shipped as PWA', world: 'system', completed: false },
  { id: '8', text: 'Leave corporate · full studio income', world: 'corp', completed: false },
];

interface OSContextType {
  activeWorld: World;
  setActiveWorld: (w: World) => void;
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  mobileView: MobileView;
  setMobileView: (v: MobileView) => void;
  focusItems: FocusItem[];
  toggleFocus: (id: number) => void;
  addFocusItem: (text: string, world: World) => void;
  milestones: VisionMilestone[];
  toggleMilestone: (id: string) => void;
  logs: string[];
  addLog: (log: string) => void;
  updateLog: (index: number, newLog: string) => void;
  deleteLog: (index: number) => void;
  user: User | null;
  logout: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // We don't throw here to prevent crashing the whole app, just log it.
}

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [activeWorld, setActiveWorld] = useState<World>('lota');
  const [activeTab, setActiveTab] = useState<Tab>('focus');
  const [mobileView, setMobileView] = useState<MobileView>('dashboard');

  const [focusItems, setFocusItems] = useState<FocusItem[]>(DEFAULT_FOCUS_ITEMS);
  const [milestones, setMilestones] = useState<VisionMilestone[]>(DEFAULT_MILESTONES);
  const [logs, setLogs] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Sync
  useEffect(() => {
    if (!isAuthReady) return;
    if (!user) {
      setFocusItems(DEFAULT_FOCUS_ITEMS);
      setMilestones(DEFAULT_MILESTONES);
      setLogs([]);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);

    // Initialize doc if it doesn't exist
    const initDoc = async () => {
      try {
        const snap = await getDoc(userDocRef);
        if (!snap.exists()) {
          await setDoc(userDocRef, {
            uid: user.uid,
            focusItems: DEFAULT_FOCUS_ITEMS,
            milestones: DEFAULT_MILESTONES,
            logs: []
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
    };
    initDoc();

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.focusItems) setFocusItems(data.focusItems);
        if (data.milestones) setMilestones(data.milestones);
        if (data.logs) setLogs(data.logs);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });

    return () => unsubscribe();
  }, [user, isAuthReady]);

  const toggleFocus = async (id: number) => {
    const newItems = focusItems.map(item => item.id === id ? { ...item, done: !item.done } : item);
    setFocusItems(newItems); // Optimistic update
    
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { focusItems: newItems }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const toggleMilestone = async (id: string) => {
    const newMilestones = milestones.map(m => m.id === id ? { ...m, completed: !m.completed } : m);
    setMilestones(newMilestones);
    
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { milestones: newMilestones }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const addFocusItem = async (text: string, world: World) => {
    if (!text.trim()) return;
    const newItem: FocusItem = {
      id: Date.now(),
      text: text.trim(),
      color: world === 'lota' ? 'bg-lota' : world === 'cucu' ? 'bg-cucu' : 'bg-corp',
      done: false
    };
    const newItems = [newItem, ...focusItems].slice(0, 20); // Keep max 20 items to respect firestore rules
    setFocusItems(newItems); // Optimistic update
    
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { focusItems: newItems }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const addLog = async (log: string) => {
    if (!log.trim()) return;
    const newLogs = [log.trim(), ...logs].slice(0, 5);
    setLogs(newLogs); // Optimistic update
    
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { logs: newLogs }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const updateLog = async (index: number, newLog: string) => {
    if (!newLog.trim()) return;
    const newLogs = [...logs];
    newLogs[index] = newLog.trim();
    setLogs(newLogs);
    
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { logs: newLogs }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const deleteLog = async (index: number) => {
    const newLogs = logs.filter((_, i) => i !== index);
    setLogs(newLogs);
    
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { logs: newLogs }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!isAuthReady) {
    return <div className="min-h-screen bg-paper flex items-center justify-center text-ink font-serif">Loading OS...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-paper-2 p-8 border border-paper-3 text-center">
          <div className="font-serif text-3xl mb-2 text-ink">Dione OS</div>
          <div className="text-xs tracking-[0.2em] uppercase text-ink-3 mb-8">Secure Cloud Sync</div>
          <p className="text-sm text-ink-2 mb-8 leading-relaxed">
            Log in to access your Personal Operating System. Your focus tasks and quick captures will be securely synced across all your devices.
          </p>
          <button 
            onClick={login}
            className="w-full bg-ink text-paper py-3 text-xs tracking-wider uppercase hover:bg-ink-2 transition-colors"
          >
            Authenticate with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <OSContext.Provider value={{
      activeWorld, setActiveWorld,
      activeTab, setActiveTab,
      mobileView, setMobileView,
      focusItems, toggleFocus, addFocusItem,
      milestones, toggleMilestone,
      logs, addLog, updateLog, deleteLog,
      user, logout,
      toastMessage, showToast
    }}>
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const context = useContext(OSContext);
  if (context === undefined) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
}
