export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface SpecItem {
  id: string;
  label: string;
  value: string;
}

export type LogType = 'new-part' | 'repair' | 'inspection' | 'note';
export type DeviceLogType = 'local-photo' | 'reference';

export interface PhotoItem {
  id: string;
  title: string;
  caption?: string;
  uri?: string;
  localAsset?: any;
  date?: string;
  specificPart?: string;
  logType?: LogType | DeviceLogType | string;
}

export type ExpenseCategory = 'parts' | 'wof_reg' | 'labor' | 'fluids' | 'other';

export interface ExpenseItem {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes?: string;
}

export interface ProjectCar {
  id: string;
  title: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  lastUpdated: string;
  nextAction?: string;
  totalSpent: number;
  image: any;
  checklist: ChecklistItem[];
  specs: SpecItem[];
  photos: PhotoItem[];
  expenses: ExpenseItem[];
}
