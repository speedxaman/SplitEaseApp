import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'splitease_expenses';
const GROUPS_KEY = 'splitease_groups';

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  groups: [],
  
  // Load data from storage
  loadData: async () => {
    try {
      const expensesData = await AsyncStorage.getItem(STORAGE_KEY);
      const groupsData = await AsyncStorage.getItem(GROUPS_KEY);
      
      set({
        expenses: expensesData ? JSON.parse(expensesData) : [],
        groups: groupsData ? JSON.parse(groupsData) : [],
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  },

  // Save to AsyncStorage
  saveExpenses: async (expenses) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  },

  saveGroups: async (groups) => {
    try {
      await AsyncStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    } catch (error) {
      console.error('Error saving groups:', error);
    }
  },

  // Add new expense
  addExpense: async (expense) => {
    const newExpense = {
      id: uuidv4(),
      ...expense,
      date: new Date().toISOString(),
    };
    
    const updatedExpenses = [...get().expenses, newExpense];
    set({ expenses: updatedExpenses });
    await get().saveExpenses(updatedExpenses);
    return newExpense;
  },

  // Delete expense
  deleteExpense: async (expenseId) => {
    const updatedExpenses = get().expenses.filter(e => e.id !== expenseId);
    set({ expenses: updatedExpenses });
    await get().saveExpenses(updatedExpenses);
  },

  // Add new group
  addGroup: async (group) => {
    const newGroup = {
      id: uuidv4(),
      ...group,
      createdAt: new Date().toISOString(),
      members: group.members || [],
    };
    
    const updatedGroups = [...get().groups, newGroup];
    set({ groups: updatedGroups });
    await get().saveGroups(updatedGroups);
    return newGroup;
  },

  // Delete group
  deleteGroup: async (groupId) => {
    const updatedGroups = get().groups.filter(g => g.id !== groupId);
    const updatedExpenses = get().expenses.filter(e => e.groupId !== groupId);
    
    set({ groups: updatedGroups, expenses: updatedExpenses });
    await get().saveGroups(updatedGroups);
    await get().saveExpenses(updatedExpenses);
  },

  // Update group
  updateGroup: async (groupId, updates) => {
    const updatedGroups = get().groups.map(g =>
      g.id === groupId ? { ...g, ...updates } : g
    );
    set({ groups: updatedGroups });
    await get().saveGroups(updatedGroups);
  },

  // Get expenses by group
  getExpensesByGroup: (groupId) => {
    return get().expenses.filter(e => e.groupId === groupId);
  },

  // Clear all data
  clearAllData: async () => {
    set({ expenses: [], groups: [] });
    await AsyncStorage.multiRemove([STORAGE_KEY, GROUPS_KEY]);
  },
}));
