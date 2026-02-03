import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../utils/theme';

export const ConfirmDialog = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmStyle = 'destructive',
}) => {
  const { theme } = useTheme();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: theme.bg.secondary }]}>
          <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.text.secondary }]}>{message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.bg.tertiary }]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelButtonText, { color: theme.text.primary }]}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                confirmStyle === 'destructive'
                  ? styles.confirmButtonDestructive
                  : styles.confirmButton,
              ]}
              onPress={onConfirm}
            >
              <Text
                style={
                  confirmStyle === 'destructive'
                    ? styles.confirmButtonTextDestructive
                    : styles.confirmButtonText
                }
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const AlertDialog = ({
  visible,
  title,
  message,
  onClose,
  buttonText = 'OK',
}) => {
  const { theme } = useTheme();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: theme.bg.secondary }]}>
          <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.text.secondary }]}>{message}</Text>

          <TouchableOpacity
            style={[styles.button, styles.confirmButton, styles.fullWidth]}
            onPress={onClose}
          >
            <Text style={styles.confirmButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    width: '85%',
    maxWidth: 320,
    ...Shadows.xlg,
    borderTopWidth: 3,
    borderTopColor: Colors.accent,
  },
  title: {
    ...Typography.h4,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  message: {
    ...Typography.body,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  fullWidth: {
    width: '100%',
  },
  cancelButton: {
  },
  cancelButtonText: {
    ...Typography.button,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderTopWidth: 2,
    borderTopColor: Colors.primaryLight,
  },
  confirmButtonText: {
    ...Typography.button,
    color: Colors.white,
    fontWeight: '700',
  },
  confirmButtonDestructive: {
    backgroundColor: Colors.danger,
    borderTopWidth: 2,
    borderTopColor: Colors.dangerLight,
  },
  confirmButtonTextDestructive: {
    ...Typography.button,
    color: Colors.white,
    fontWeight: '700',
  },
});
