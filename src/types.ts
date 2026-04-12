
export enum Role {
  Staff = 'staff',
  Recycler = 'recycler',
  Admin = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  last_login?: string;
}

export interface Bin {
  id: string;
  name: string;
  location: string;
  capacity: number;
  current_count: number;
  qr_code: string;
  assigned_recycler_id: string;
  status: 'active' | 'full' | 'awaiting-pickup';
  last_updated: string;
}

export interface PickupItem {
  type: string;
  quantity: number;
}

export interface Pickup {
  id: string;
  bin_id: string;
  recycler_id: string;
  request_time: string;
  estimated_weight: number;
  estimated_payment: number;
  status: 'pending' | 'accepted' | 'completed' | 'canceled';
  completed_at: string | null;
  requester_id: string | null; // ID of the staff who requested it, null for auto-requests
  notes: string | null; // Optional notes from the staff
  // FIX: Made items optional to accommodate auto-triggered pickups without item lists.
  items?: PickupItem[];
}

export interface Payment {
  id: string;
  pickup_id: string;
  recycler_id: string;
  amount: number;
  weight: number;
  status: 'pending' | 'paid';
  timestamp: string;
  paid_at: string;
}

// FIX: Add ScanLog interface to support item scanning functionality.
export interface ScanLog {
  id: string;
  bin_id: string;
  staff_id: string;
  items: {
    type: string;
    quantity: number;
    weight: number;
  }[];
  timestamp: string;
  created_at: string;
}

export interface EWasteItem {
    type: string;
    weight_kg: number;
    price_per_kg: number;
}

export interface Settings {
    collegeName: string;
    adminEmail: string;
    itemPrices: EWasteItem[];
}

export interface BinIssue {
    id: string;
    bin_id: string;
    reporter_id: string;
    issue_type: 'damage' | 'overflow' | 'misplaced' | 'other';
    description: string;
    status: 'pending' | 'resolved';
    timestamp: string;
}

export interface ChatMessage {
    id: string;
    pickup_id: string;
    sender_id: string;
    sender_role: Role;
    content: string;
    timestamp: string;
}
