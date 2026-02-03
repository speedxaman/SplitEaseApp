import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useExpenseStore } from '../store/expenseStore';
import { useTheme } from '../utils/ThemeContext';
import { ExpenseItem } from '../components/ExpenseComponents';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../utils/theme';
import {
  calculateBalances,
  formatCurrency,
  userOwesBalance,
  userIsOwedBalance,
} from '../utils/calculateSplits';

export const GroupDetailScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { group } = route.params;
  const { expenses, deleteExpense } = useExpenseStore();
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({
    visible: false,
    expenseId: null,
  });

  useEffect(() => {
    const filtered = expenses.filter(e => e.groupId === group.id);
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setGroupExpenses(sorted);
  }, [expenses, group.id]);

  const balances = useMemo(() => {
    return calculateBalances(groupExpenses, group.members);
  }, [groupExpenses, group.members]);

  const getMemberName = (memberId) => {
    const member = group.members?.find(m => m.id === memberId || m === memberId);
    return member?.name || member || memberId;
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

  const totalExpense = groupExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averagePerPerson = group.members?.length > 0 ? totalExpense / group.members.length : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      {/* Summary */}
      <View style={[styles.summaryContainer, { backgroundColor: theme.bg.secondary, borderBottomColor: theme.border }]}>
        <View style={[styles.summaryBox, { backgroundColor: theme.bg.tertiary }]}>
          <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Total</Text>
          <Text style={[styles.summaryAmount, { color: Colors.primary }]}>{formatCurrency(totalExpense)}</Text>
        </View>
        <View style={[styles.summaryBox, { backgroundColor: theme.bg.tertiary }]}>
          <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Per Person</Text>
          <Text style={[styles.summaryAmount, { color: Colors.primary }]}>{formatCurrency(averagePerPerson)}</Text>
        </View>
      </View>

      {/* Balances */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Member Balances</Text>
        {group.members && group.members.length > 0 ? (
          group.members.map(member => {
            const memberId = member.id || member;
            const memberName = getMemberName(memberId);
            const balance = balances[memberId] || 0;
            const owes = userOwesBalance(memberId, balances);
            const isOwed = userIsOwedBalance(memberId, balances);

            return (
              <View key={memberId} style={[styles.balanceRow, { backgroundColor: theme.bg.secondary }]}>
                <View>
                  <Text style={[styles.memberName, { color: theme.text.primary }]}>{memberName}</Text>
                  {balance === 0 ? (
                    <Text style={[styles.balanceSettled, { color: theme.text.secondary }]}>Settled up</Text>
                  ) : (
                    <Text
                      style={[
                        styles.balanceText,
                        balance < 0 ? styles.owesText : styles.isOwedText,
                      ]}
                    >
                      {balance < 0 ? 'Owes' : 'Is owed'}{' '}
                      {formatCurrency(balance < 0 ? owes : isOwed)}
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    styles.balanceBadge,
                    balance < 0 ? styles.balanceBadgeNegative : styles.balanceBadgePositive,
                  ]}
                >
                  <Text style={styles.balanceBadgeText}>
                    {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={[styles.emptyText, { color: theme.text.secondary }]}>No members in this group</Text>
        )}
      </View>

      {/* Expenses */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Expenses ({groupExpenses.length})</Text>
        {groupExpenses.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.text.secondary }]}>No expenses added yet</Text>
        ) : (
          <FlatList
            data={groupExpenses}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <ExpenseItem
                expense={{
                  ...item,
                  paidByName: getMemberName(item.paidBy),
                }}
                onDelete={handleDelete}
              />
            )}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 2,
    borderBottomColor: Colors.accent,
    ...Shadows.md,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: Colors.gray50,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.lg,
    borderTopWidth: 2,
    borderTopColor: Colors.accent,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  balanceText: {
    fontSize: 12,
  },
  owesText: {
    color: '#FF3B30',
  },
  isOwedText: {
    color: '#34C759',
  },
  balanceSettled: {
    fontSize: 12,
    color: '#999',
  },
  balanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  balanceBadgePositive: {
    backgroundColor: '#34C75930',
  },
  balanceBadgeNegative: {
    backgroundColor: '#FF3B3030',
  },
  balanceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
