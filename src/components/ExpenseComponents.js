import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatCurrency, formatDate } from '../utils/calculateSplits';
import { useTheme } from '../utils/ThemeContext';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../utils/theme';

export const ExpenseItem = ({ expense, onDelete, onPress }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.expenseItem, { backgroundColor: theme.bg.secondary, borderLeftColor: Colors.primary }]}>
      <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
        <View style={styles.expenseContent}>
          <Text style={[styles.expenseTitle, { color: theme.text.primary }]}>{expense.description}</Text>
          <Text style={[styles.expenseDate, { color: theme.text.secondary }]}>{formatDate(expense.date)}</Text>
          <Text style={[styles.expensePaidBy, { color: theme.text.tertiary }]}>Paid by: {expense.paidByName}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.expenseAmount}>
        <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete && onDelete(expense.id)}
        >
          <MaterialCommunityIcons name="trash-can" size={16} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const GroupCard = ({ group, onPress, onDelete }) => {
  const { theme } = useTheme();
  const memberCount = group.members?.length || 0;

  return (
    <View style={[styles.groupCard, { backgroundColor: theme.bg.secondary }]}>
      <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
        <View style={styles.groupHeader}>
          <MaterialCommunityIcons name="account-multiple" size={20} color={Colors.success} />
          <Text style={[styles.groupName, { color: theme.text.primary }]}>{group.name}</Text>
        </View>
        <Text style={[styles.memberCount, { color: theme.text.secondary }]}>{memberCount} members</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete && onDelete(group.id)}
      >
        <MaterialCommunityIcons name="trash-can" size={16} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export const SettlementItem = ({ settlement, memberNames = {} }) => {
  const { theme } = useTheme();
  const fromName = memberNames[settlement.from] || settlement.from;
  const toName = memberNames[settlement.to] || settlement.to;

  return (
    <View style={[styles.settlementItem, { backgroundColor: theme.bg.secondary, borderLeftColor: Colors.warning }]}>
      <View style={styles.settlementContent}>
        <Text style={[styles.settlementText, { color: theme.text.primary }]}>
          <Text style={{ fontWeight: '700' }}>{fromName}</Text> pays{' '}
          <Text style={{ fontWeight: '700' }}>{toName}</Text>
        </Text>
      </View>
      <Text style={styles.settlementAmount}>{formatCurrency(settlement.amount)}</Text>
    </View>
  );
};

export const MemberItem = ({ member, onRemove }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.memberItem, { backgroundColor: theme.bg.tertiary }]}>
      <MaterialCommunityIcons name="account-circle" size={20} color={Colors.primary} />
      <Text style={[styles.memberName, { marginLeft: Spacing.md, color: theme.text.primary }]}>
        {member.name || member}
      </Text>
      {onRemove && (
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => onRemove(member.id || member)}
        >
          <MaterialCommunityIcons name="close" size={14} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export const BalanceCard = ({ memberName, balance }) => {
  const { theme } = useTheme();
  const isNegative = balance < 0;
  const absoluteBalance = Math.abs(balance);

  return (
    <View style={[styles.balanceCard, isNegative && styles.balanceCardNegative]}>
      <MaterialCommunityIcons
        name={isNegative ? 'arrow-top-right' : 'arrow-bottom-left'}
        size={32}
        color={Colors.white}
        style={{ marginBottom: Spacing.sm }}
      />
      <Text style={styles.balanceStatus}>
        {isNegative ? 'You owe' : 'You are owed'}
      </Text>
      <Text style={styles.balanceAmount}>{formatCurrency(absoluteBalance)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.lg,
    borderLeftWidth: 5,
    borderTopWidth: 1,
    borderTopColor: Colors.accentLight,
  },
  expenseContent: {
    flex: 1,
  },
  expenseTitle: {
    ...Typography.bodyMedium,
    marginBottom: Spacing.xs,
  },
  expenseDate: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  expensePaidBy: {
    ...Typography.caption,
  },
  expenseAmount: {
    alignItems: 'flex-end',
    marginLeft: Spacing.lg,
  },
  amount: {
    ...Typography.h4,
    color: Colors.accent,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  deleteBtn: {
    padding: Spacing.sm,
    backgroundColor: Colors.danger,
    borderRadius: BorderRadius.round,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  deleteBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  groupCard: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.lg,
    borderTopWidth: 5,
    borderTopColor: Colors.accent,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accentLight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  groupName: {
    ...Typography.h4,
    fontWeight: '700',
    marginLeft: Spacing.md,
  },
  memberCount: {
    ...Typography.bodySmall,
    marginLeft: 28,
  },
  settlementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.lg,
    borderLeftWidth: 5,
    borderTopWidth: 1,
    borderTopColor: Colors.accentLight,
  },
  settlementContent: {
    flex: 1,
  },
  settlementText: {
    ...Typography.bodySmall,
    lineHeight: 20,
  },
  settlementAmount: {
    ...Typography.h4,
    fontWeight: '700',
    color: Colors.accent,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  memberName: {
    ...Typography.bodySmall,
    flex: 1,
  },
  removeBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.danger,
    borderRadius: BorderRadius.md,
  },
  removeBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.lg,
    borderTopWidth: 3,
    borderTopColor: Colors.accent,
  },
  balanceCardNegative: {
    backgroundColor: Colors.danger,
  },
  balanceStatus: {
    ...Typography.bodySmall,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  balanceAmount: {
    ...Typography.h1,
    fontWeight: '700',
    color: Colors.white,
  },
});
