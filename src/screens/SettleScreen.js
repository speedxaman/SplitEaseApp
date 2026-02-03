import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useExpenseStore } from '../store/expenseStore';
import { useTheme } from '../utils/ThemeContext';
import {
  calculateBalances,
  calculateSettlements,
  formatCurrency,
  userOwesBalance,
  userIsOwedBalance,
} from '../utils/calculateSplits';
import { SettlementItem, BalanceCard } from '../components/ExpenseComponents';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../utils/theme';

export const SettleScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { expenses, groups } = useExpenseStore();
  const [selectedGroupId, setSelectedGroupId] = useState(
    groups.length > 0 ? groups[0].id : null
  );

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  const groupExpenses = useMemo(() => {
    return expenses.filter(e => e.groupId === selectedGroupId);
  }, [expenses, selectedGroupId]);

  const balances = useMemo(() => {
    const members = selectedGroup?.members || [];
    return calculateBalances(groupExpenses, members);
  }, [groupExpenses, selectedGroup]);

  const settlements = useMemo(() => {
    return calculateSettlements(balances);
  }, [balances]);

  const memberNames = useMemo(() => {
    const names = {};
    selectedGroup?.members?.forEach(member => {
      names[member.id || member] = member.name || member;
    });
    return names;
  }, [selectedGroup]);

  const totalExpense = useMemo(() => {
    return groupExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [groupExpenses]);

  const averagePerPerson = useMemo(() => {
    if (!selectedGroup?.members || selectedGroup.members.length === 0) return 0;
    return totalExpense / selectedGroup.members.length;
  }, [totalExpense, selectedGroup]);

  if (!selectedGroup) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
        <View style={[styles.header, { backgroundColor: theme.bg.secondary, borderBottomColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text.primary }]}>Settlements</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.text.tertiary }]}>No groups available</Text>
          <TouchableOpacity
            style={[styles.createBtn, { backgroundColor: Colors.primary }]}
            onPress={() => navigation.navigate('Groups')}
          >
            <Text style={styles.createBtnText}>Create a Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <View style={[styles.header, { backgroundColor: theme.bg.secondary, borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text.primary }]}>Settlements</Text>
      </View>

      <ScrollView>
        {/* Group Selector */}
        <ScrollView
          horizontal
          style={[styles.groupSelector, { backgroundColor: theme.bg.secondary, borderBottomColor: theme.border }]}
          showsHorizontalScrollIndicator={false}
        >
          {groups.map(group => (
            <TouchableOpacity
              key={group.id}
              style={[
                styles.groupTab,
                selectedGroupId === group.id && [styles.groupTabActive, { backgroundColor: Colors.primary }],
                selectedGroupId !== group.id && { backgroundColor: theme.bg.tertiary }
              ]}
              onPress={() => setSelectedGroupId(group.id)}
            >
              <Text
                style={[
                  styles.groupTabText,
                  selectedGroupId === group.id && styles.groupTabTextActive,
                  selectedGroupId !== group.id && { color: theme.text.secondary }
                ]}
              >
                {group.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryBox, { backgroundColor: theme.bg.secondary }]}>
            <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Total Expenses</Text>
            <Text style={[styles.summaryAmount, { color: Colors.primary }]}>{formatCurrency(totalExpense)}</Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: theme.bg.secondary }]}>
            <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Per Person</Text>
            <Text style={[styles.summaryAmount, { color: Colors.primary }]}>{formatCurrency(averagePerPerson)}</Text>
          </View>
        </View>

        {/* Balances */}
        {selectedGroup.members && selectedGroup.members.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Individual Balances</Text>
            {selectedGroup.members.map(member => {
              const memberId = member.id || member;
              const memberName = member.name || member;
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
            })}
          </View>
        )}

        {/* Settlements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Settlements Needed</Text>
          {settlements.length === 0 ? (
            <View style={[styles.settledContainer, { backgroundColor: Colors.success }]}>
              <Text style={styles.settledText}>✓ Everyone is settled up!</Text>
            </View>
          ) : (
            <FlatList
              data={settlements}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <SettlementItem
                  settlement={item}
                  memberNames={memberNames}
                />
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 2,
    borderBottomColor: Colors.accent,
    ...Shadows.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  groupSelector: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  groupTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  groupTabActive: {
    backgroundColor: '#007AFF',
  },
  groupTabText: {
    fontSize: 14,
    color: '#666',
  },
  groupTabTextActive: {
    color: '#fff',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontSize: 18,
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
  settledContainer: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  settledText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginBottom: 16,
  },
  createBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
