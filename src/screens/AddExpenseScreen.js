import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { useExpenseStore } from '../store/expenseStore';
import { useTheme } from '../utils/ThemeContext';
import { MemberItem } from '../components/ExpenseComponents';
import { AlertDialog } from '../components/ConfirmDialog';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../utils/theme';

export const AddExpenseScreen = ({ navigation }) => {
  const { addExpense, groups } = useExpenseStore();
  const { theme } = useTheme();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [splitBetween, setSplitBetween] = useState([]);
  const [alertDialog, setAlertDialog] = useState({
    visible: false,
    title: '',
    message: '',
  });

  useEffect(() => {
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0].id);
    }
  }, [groups]);

  useEffect(() => {
    if (selectedGroup) {
      const group = groups.find(g => g.id === selectedGroup);
      if (group && group.members) {
        setSplitBetween(group.members.map(m => m.id || m));
      }
    }
  }, [selectedGroup]);

  const getMemberName = (memberId) => {
    const group = groups.find(g => g.id === selectedGroup);
    if (group && group.members) {
      const member = group.members.find(m => m.id === memberId || m === memberId);
      return member?.name || member || memberId;
    }
    return memberId;
  };

  const handleToggleMember = (memberId) => {
    if (splitBetween.includes(memberId)) {
      setSplitBetween(splitBetween.filter(m => m !== memberId));
    } else {
      setSplitBetween([...splitBetween, memberId]);
    }
  };

  const handleAddExpense = async () => {
    if (!description.trim()) {
      setAlertDialog({
        visible: true,
        title: 'Invalid Input',
        message: 'Please enter a description',
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setAlertDialog({
        visible: true,
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
      });
      return;
    }

    if (!paidBy) {
      setAlertDialog({
        visible: true,
        title: 'Missing Selection',
        message: 'Please select who paid',
      });
      return;
    }

    if (splitBetween.length === 0) {
      setAlertDialog({
        visible: true,
        title: 'Missing Selection',
        message: 'Please select members to split between',
      });
      return;
    }

    const expense = {
      description,
      amount: parseFloat(amount),
      paidBy,
      groupId: selectedGroup,
      splitBetween,
    };

    await addExpense(expense);
    setAlertDialog({
      visible: true,
      title: 'Success',
      message: 'Expense added successfully!',
    });
    setDescription('');
    setAmount('');
    setPaidBy('');
    setSplitBetween([]);
  };

  const currentGroup = groups.find(g => g.id === selectedGroup);
  const members = currentGroup?.members || [];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <View style={styles.content}>
        <Text style={[styles.label, { color: theme.text.primary }]}>Group</Text>
        {groups.length === 0 ? (
          <View style={[styles.emptyMessage, { backgroundColor: theme.bg.tertiary }]}>
            <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
              No groups available. Create a group first.
            </Text>
            <TouchableOpacity
              style={styles.createGroupBtn}
              onPress={() => navigation.navigate('Groups')}
            >
              <Text style={styles.createGroupBtnText}>Create Group</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.groupSelector}>
              {groups.map(group => (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.groupOption,
                    selectedGroup === group.id && styles.groupOptionActive,
                    { backgroundColor: selectedGroup === group.id ? Colors.primary : theme.bg.tertiary }
                  ]}
                  onPress={() => setSelectedGroup(group.id)}
                >
                  <Text
                    style={[
                      styles.groupOptionText,
                      selectedGroup === group.id ? styles.groupOptionTextActive : { color: theme.text.primary }
                    ]}
                  >
                    {group.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: theme.text.primary }]}>Description</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.bg.tertiary, color: theme.text.primary, borderColor: theme.border }]}
              placeholderTextColor={theme.text.tertiary}
              placeholder="e.g., Dinner, Groceries"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={[styles.label, { color: theme.text.primary }]}>Amount</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.bg.tertiary, color: theme.text.primary, borderColor: theme.border }]}
              placeholderTextColor={theme.text.tertiary}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />

            <Text style={[styles.label, { color: theme.text.primary }]}>Paid By</Text>
            <View style={[styles.memberList, { backgroundColor: theme.bg.secondary, borderColor: theme.border }]}>
              {members.map(member => (
                <TouchableOpacity
                  key={member.id || member}
                  style={[
                    styles.memberOption,
                    { borderBottomColor: theme.border },
                    paidBy === (member.id || member) && [styles.memberOptionActive, { backgroundColor: theme.bg.tertiary }],
                  ]}
                  onPress={() => setPaidBy(member.id || member)}
                >
                  <View style={[styles.radio, { borderColor: Colors.primary }]}>
                    {paidBy === (member.id || member) && (
                      <View style={[styles.radioActive, { backgroundColor: Colors.primary }]} />
                    )}
                  </View>
                  <Text style={[styles.memberName, { color: theme.text.primary }]}>{getMemberName(member.id || member)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: theme.text.primary }]}>Split Between</Text>
            <View style={[styles.memberList, { backgroundColor: theme.bg.secondary, borderColor: theme.border }]}>
              {members.map(member => (
                <TouchableOpacity
                  key={member.id || member}
                  style={[
                    styles.memberOption,
                    { borderBottomColor: theme.border },
                    splitBetween.includes(member.id || member) && [styles.memberOptionActive, { backgroundColor: theme.bg.tertiary }],
                  ]}
                  onPress={() => handleToggleMember(member.id || member)}
                >
                  <View style={[styles.checkbox, { borderColor: Colors.primary }]}>
                    {splitBetween.includes(member.id || member) && (
                      <Text style={[styles.checkmark, { color: Colors.primary }]}>✓</Text>
                    )}
                  </View>
                  <Text style={[styles.memberName, { color: theme.text.primary }]}>{getMemberName(member.id || member)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: Colors.primary }]}
              onPress={handleAddExpense}
            >
              <Text style={styles.addButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </>
        )}

        <AlertDialog
          visible={alertDialog.visible}
          title={alertDialog.title}
          message={alertDialog.message}
          onClose={() => setAlertDialog({ visible: false, title: '', message: '' })}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  groupSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  groupOption: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.round,
    borderWidth: 2,
    borderColor: '#ddd',
    ...Shadows.md,
  },
  groupOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  groupOptionText: {
    fontSize: 14,
    color: '#666',
  },
  groupOptionTextActive: {
    color: '#fff',
  },
  memberList: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    overflow: 'hidden',
    ...Shadows.md,
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  memberOptionActive: {
    backgroundColor: '#f0f0f0',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  memberName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyMessage: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  createGroupBtn: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  createGroupBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
