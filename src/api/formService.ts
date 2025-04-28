import { v4 as uuidv4 } from 'uuid';

// Define the form data structure
export interface FormEntry {
  id: string;
  name: string;
  email: string;
  skills: {
    name: string;
    level: number;
  }[];
}

// In-memory storage for form entries
let formEntries: FormEntry[] = [
  {
    id: '1',
    name: 'Cristian Schuszter',
    email: 'cristi@cern.ch',
    skills: [
      { name: 'JavaScript', level: 4 },
      { name: 'React', level: 5 },
      { name: 'TypeScript', level: 5 }
    ]
  },
  {
    id: '2',
    name: 'Victor Uria Valle',
    email: 'victor@cern.ch',
    skills: [
      { name: 'Python', level: 5 },
      { name: 'Data Analysis', level: 4 },
      { name: 'Machine Learning', level: 3 }
    ]
  },
  {
    id: '3',
    name: 'Ruben Strong',
    email: 'ruben@expedia.com',
    skills: [
      { name: 'Strong', level: 5 },
      { name: 'Very strong', level: 5 },
      { name: 'Weak', level: 0 }
    ]
  }
];

// Get all form entries
export const getAllEntries = (): Promise<FormEntry[]> => {
  return Promise.resolve([...formEntries]);
};

// Get a specific entry by ID
export const getEntryById = (id: string): Promise<FormEntry | undefined> => {
  const entry = formEntries.find(entry => entry.id === id);
  return Promise.resolve(entry);
};

// Create a new entry
export const createEntry = (entry: Omit<FormEntry, 'id'>): Promise<FormEntry> => {
  const newEntry = {
    ...entry,
    id: uuidv4()
  };
  formEntries.push(newEntry);
  return Promise.resolve(newEntry);
};

// Update an existing entry
export const updateEntry = (id: string, updatedEntry: Omit<FormEntry, 'id'>): Promise<FormEntry | null> => {
  const index = formEntries.findIndex(entry => entry.id === id);
  if (index === -1) {
    return Promise.resolve(null);
  }

  const updated = {
    ...updatedEntry,
    id
  };

  formEntries[index] = updated;
  return Promise.resolve(updated);
};

// Delete an entry
export const deleteEntry = (id: string): Promise<boolean> => {
  const initialLength = formEntries.length;
  formEntries = formEntries.filter(entry => entry.id !== id);
  return Promise.resolve(formEntries.length < initialLength);
};
