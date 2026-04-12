
import { Role, User, Bin } from './types';

export const USERS_COLLECTION = 'users';
export const BINS_COLLECTION = 'bins';
export const PICKUPS_COLLECTION = 'pickups';
export const PAYMENTS_COLLECTION = 'payments';
export const SCAN_LOGS_COLLECTION = 'scanLogs';
export const SETTINGS_COLLECTION = 'settings';
export const BIN_ISSUES_COLLECTION = 'binIssues';
export const MESSAGES_COLLECTION = 'messages';

export const USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@campus.edu', role: Role.Admin },
  { id: '2', name: 'Staff User', email: 'staff@campus.edu', role: Role.Staff },
  { id: '3', name: 'Recycler Co.', email: 'recycler@ewaste.com', role: Role.Recycler },
  { id: '4', name: 'Jane Doe (Staff)', email: 'jane.doe@campus.edu', role: Role.Staff },
];

export const BINS: Bin[] = [
  { id: '101', name: 'Library Entrance Bin', location: 'Main Library, 1st Floor', capacity: 20, current_count: 18, qr_code: 'BIN101', assigned_recycler_id: '3', status: 'active', last_updated: new Date().toISOString() },
  { id: '102', name: 'Engineering Block C', location: 'Block C, Room 204', capacity: 15, current_count: 5, qr_code: 'BIN102', assigned_recycler_id: '3', status: 'active', last_updated: new Date().toISOString() },
  { id: '103', name: 'Cafeteria Bin', location: 'Student Union Building', capacity: 25, current_count: 25, qr_code: 'BIN103', assigned_recycler_id: '3', status: 'awaiting-pickup', last_updated: new Date().toISOString() },
  { id: '104', name: 'Admin Building', location: 'Ground Floor, Reception', capacity: 10, current_count: 2, qr_code: 'BIN104', assigned_recycler_id: '3', status: 'active', last_updated: new Date().toISOString() },
];

export const EWASTE_ITEMS = [
  { type: 'Battery', weight_kg: 0.05, price_per_kg: 2.5 },
  { type: 'Keyboard', weight_kg: 0.5, price_per_kg: 1.2 },
  { type: 'Mouse', weight_kg: 0.1, price_per_kg: 1.5 },
  { type: 'Smartphone', weight_kg: 0.15, price_per_kg: 5.0 },
  { type: 'Laptop', weight_kg: 2.0, price_per_kg: 3.0 },
  { type: 'Charger/Cable', weight_kg: 0.08, price_per_kg: 0.8 },
  { type: 'Monitor', weight_kg: 4.0, price_per_kg: 1.0 },
];