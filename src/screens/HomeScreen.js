import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useExpenseStore } from '../store/expenseStore';
import { useTheme } from '../utils/ThemeContext';
import { useAuth } from '../utils/AuthContext';
import { ExpenseItem } from '../components/ExpenseComponents';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../utils/theme';

export const HomeScreen = ({ navigation }) => {
  const { expenses, deleteExpense, groups } = useExpenseStore();
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [displayExpenses, setDisplayExpenses] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({
    visible: false,
    expenseId: null,
  });

  useEffect(() => {
    // Sort expenses by date, newest first
    const sorted = [...expenses].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setDisplayExpenses(sorted);
  }, [expenses]);

  const getMemberName = (memberId) => {
    for (const group of groups) {
      const member = group.members?.find(m => m.id === memberId || m === memberId);
      if (member) return member.name || member;
    }
    return memberId;
  };

  const handleDelete = (expenseId) => {
    setDeleteDialog({ visible: true, expenseId });
  };

  const confirmDelete = () => {
    if (deleteDialog.expenseId) {
      deleteExpense(deleteDialog.expenseId);
    }
    setDeleteDialog({ visible: false, expenseId: null });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <View style={[styles.header, { backgroundColor: theme.bg.secondary, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: theme.text.primary }]}>Expenses</Text>
          {user && (
            <Text style={[styles.userName, { color: theme.text.secondary }]}>{user.name}</Text>
          )}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.themeToggle]}
            onPress={toggleTheme}
          >
            <MaterialCommunityIcons
              name={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'}
              size={20}
              color={Colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: Colors.danger }]}
            onPress={logout}
          >
            <MaterialCommunityIcons name="logout" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {displayExpenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="cash-multiple"
            size={64}
            color={theme.text.tertiary}
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyText, { color: theme.text.secondary }]}>No expenses yet</Text>
          <Text style={[styles.emptySubtext, { color: theme.text.tertiary }]}>
            Add an expense to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayExpenses}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ExpenseItem
              expense={{
                ...item,
                paidByName: getMemberName(item.paidBy),
              }}
              onDelete={handleDelete}
              onPress={() =>
                navigation.navigate('ExpenseDetail', { expense: item })
              }
            />
          )}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={true}
        />
      )}

      <ConfirmDialog
        visible={deleteDialog.visible}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ visible: false, expenseId: null })}
        confirmText="Delete"
        cancelText="Cancel"
        confirmStyle="destructive"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.accent,
    ...Shadows.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  title: {
    ...Typography.h2,
    fontWeight: '700',
    background: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.accent} 100%)`,
    color: Colors.primary,
  },
  userName: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  themeToggle: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.transparentPrimary,
    ...Shadows.md,
  },
  logoutButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
    borderTopWidth: 2,
    borderTopColor: Colors.dangerLight,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  listContainer: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: Spacing.lg,
  },
  emptyText: {
    ...Typography.h4,
    marginBottom: Spacing.md,
  },
  emptySubtext: {
    ...Typography.bodySmall,
  },
});
