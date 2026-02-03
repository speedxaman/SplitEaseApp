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
import { ConfirmDialog, AlertDialog } from '../components/ConfirmDialog';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../utils/theme';

export const GroupsScreen = ({ navigation }) => {
  const { groups, addGroup, deleteGroup } = useExpenseStore();
  const { theme } = useTheme();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({
    visible: false,
    groupId: null,
  });
  const [alertDialog, setAlertDialog] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const handleAddMember = () => {
    if (memberInput.trim() === '') {
      setAlertDialog({
        visible: true,
        title: 'Invalid Input',
        message: 'Please enter a member name',
      });
      return;
    }

    const newMember = {
      id: `${Date.now()}-${Math.random()}`,
      name: memberInput.trim(),
    };

    setMembers([...members, newMember]);
    setMemberInput('');
  };

  const handleRemoveMember = (memberId) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setAlertDialog({
        visible: true,
        title: 'Invalid Input',
        message: 'Please enter a group name',
      });
      return;
    }

    if (members.length < 2) {
      setAlertDialog({
        visible: true,
        title: 'Insufficient Members',
        message: 'Please add at least 2 members',
      });
      return;
    }

    const group = {
      name: groupName.trim(),
      members: members,
    };

    await addGroup(group);
    setAlertDialog({
      visible: true,
      title: 'Success',
      message: 'Group created successfully!',
    });

    setGroupName('');
    setMembers([]);
    setShowCreateForm(false);
  };

  const handleDeleteGroup = (groupId) => {
    setDeleteDialog({ visible: true, groupId });
  };

  const confirmDeleteGroup = () => {
    if (deleteDialog.groupId) {
      deleteGroup(deleteDialog.groupId);
    }
    setDeleteDialog({ visible: false, groupId: null });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <View style={[styles.header, { backgroundColor: theme.bg.secondary, borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text.primary }]}>Groups</Text>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: Colors.success }]}
          onPress={() => setShowCreateForm(!showCreateForm)}
        >
          <Text style={styles.createButtonText}>
            {showCreateForm ? 'Cancel' : '+ Create'}
          </Text>
        </TouchableOpacity>
      </View>

      {showCreateForm && (
        <ScrollView style={[styles.formContainer, { backgroundColor: theme.bg.primary }]}>
          <Text style={[styles.label, { color: theme.text.primary }]}>Group Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.bg.tertiary, color: theme.text.primary, borderColor: theme.border }]}
            placeholderTextColor={theme.text.tertiary}
            placeholder="e.g., Roommates, Weekend Trip"
            value={groupName}
            onChangeText={setGroupName}
          />

          <Text style={[styles.label, { color: theme.text.primary }]}>Add Members</Text>
          <View style={styles.memberInputContainer}>
            <TextInput
              style={[styles.memberInput, { backgroundColor: theme.bg.tertiary, color: theme.text.primary, borderColor: theme.border }]}
              placeholderTextColor={theme.text.tertiary}
              placeholder="Enter member name"
              value={memberInput}
              onChangeText={setMemberInput}
              onSubmitEditing={handleAddMember}
            />
            <TouchableOpacity
              style={[styles.addMemberButton, { backgroundColor: Colors.primary }]}
              onPress={handleAddMember}
            >
              <Text style={styles.addMemberButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {members.length > 0 && (
            <>
              <Text style={[styles.label, { color: theme.text.primary }]}>Members ({members.length})</Text>
              <View style={styles.membersList}>
                {members.map(member => (
                  <MemberItem
                    key={member.id}
                    member={member}
                    onRemove={handleRemoveMember}
                  />
                ))}
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.createGroupButton, { backgroundColor: Colors.success }]}
            onPress={handleCreateGroup}
          >
            <Text style={styles.createGroupButtonText}>Create Group</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {groups.length === 0 && !showCreateForm ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.text.tertiary }]}>No groups yet</Text>
          <Text style={[styles.emptySubtext, { color: theme.text.tertiary }]}>
            Create a group to start tracking expenses
          </Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.groupItem, { backgroundColor: theme.bg.secondary }]}
              onPress={() =>
                navigation.navigate('GroupDetail', { group: item })
              }
            >
              <View style={styles.groupInfo}>
                <Text style={[styles.groupName, { color: theme.text.primary }]}>{item.name}</Text>
                <Text style={[styles.memberCount, { color: theme.text.secondary }]}>
                  {item.members?.length || 0} members
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.deleteBtn, { backgroundColor: Colors.danger }]}
                onPress={() => handleDeleteGroup(item.id)}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={true}
        />
      )}

      <ConfirmDialog
        visible={deleteDialog.visible}
        title="Delete Group"
        message="Delete this group and all its expenses? This action cannot be undone."
        onConfirm={confirmDeleteGroup}
        onCancel={() => setDeleteDialog({ visible: false, groupId: null })}
        confirmText="Delete"
        cancelText="Cancel"
        confirmStyle="destructive"
      />

      <AlertDialog
        visible={alertDialog.visible}
        title={alertDialog.title}
        message={alertDialog.message}
        onClose={() => setAlertDialog({ visible: false, title: '', message: '' })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  createButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
    borderTopWidth: 2,
    borderTopColor: Colors.accentLight,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    maxHeight: 400,
    ...Shadows.lg,
    borderTopWidth: 3,
    borderTopColor: Colors.accent,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  memberInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  memberInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addMemberButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    ...Shadows.md,
  },
  addMemberButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  membersList: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  createGroupButton: {
    backgroundColor: Colors.accent,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.lg,
    borderTopWidth: 2,
    borderTopColor: Colors.accentLight,
  },
  createGroupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 12,
  },
  groupItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 14,
    color: '#999',
  },
  deleteBtn: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
  },
});
