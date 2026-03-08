/**
 * Confirmation Dialog Component
 * @module components/ConfirmDialog
 */
import React from 'react';
import {
  View, Text, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants';

const ConfirmDialog = ({
  visible, title, message, confirmText = 'Confirmer', cancelText = 'Annuler',
  type = 'danger', onConfirm, onCancel, loading = false,
}) => {
  const styles_type = {
    danger: { color: Colors.error.main, icon: 'alert-circle' },
    warning: { color: Colors.warning.main, icon: 'alert' },
    info: { color: Colors.primary.main, icon: 'information' },
  }[type];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <Icon name={styles_type.icon} size={48} color={styles_type.color} />
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              <View style={styles.buttons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} disabled={loading}>
                  <Text style={styles.cancelText}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmBtn, { backgroundColor: styles_type.color }]}
                  onPress={onConfirm} disabled={loading}
                >
                  <Text style={styles.confirmText}>{loading ? '...' : confirmText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export const useConfirmDialog = () => {
  const [state, setState] = React.useState({ visible: false, resolve: null });

  const showConfirm = (opts) => new Promise((resolve) => {
    setState({ ...opts, visible: true, resolve });
  });

  const handleConfirm = () => { setState(s => ({ ...s, visible: false })); state.resolve?.(true); };
  const handleCancel = () => { setState(s => ({ ...s, visible: false })); state.resolve?.(false); };

  const DialogComponent = (
    <ConfirmDialog {...state} onConfirm={handleConfirm} onCancel={handleCancel} />
  );

  return { showConfirm, DialogComponent };
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'center', alignItems: 'center', padding: 24 },
  dialog: { backgroundColor: Colors.background.primary, borderRadius: 16, padding: 24, width: '100%', maxWidth: 340, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', color: Colors.text.primary, marginTop: 16, marginBottom: 8 },
  message: { fontSize: 14, color: Colors.text.secondary, textAlign: 'center', marginBottom: 24 },
  buttons: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: Colors.background.secondary, alignItems: 'center' },
  cancelText: { fontSize: 14, fontWeight: '600', color: Colors.text.primary },
  confirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  confirmText: { fontSize: 14, fontWeight: '600', color: Colors.text.inverse },
});

export default ConfirmDialog;
