/**
 * ScanQRScreen
 * Native-style camera interface for scanning QR codes
 * @module screens/QuickActions/ScanQRScreen
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Spacing } from '../../constants';

function ScanQRScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    // In a real app, use react-native-permissions or react-native-camera
    // For now, simulate permission
    setHasPermission(true);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(
      'QR Code Scanned',
      `Type: ${type}\nData: ${data}`,
      [
        { text: 'Scan Again', onPress: () => setScanned(false) },
        { text: 'OK', onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleFlashToggle = () => {
    setFlashEnabled(!flashEnabled);
  };

  const handleManualEntry = () => {
    Alert.alert('Manual Entry', 'Enter payment details manually', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('SendMoney'),
      },
    ]);
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.centerContent}>
          <Icon name="camera-off" size={64} color="rgba(255, 255, 255, 0.4)" />
          <Text style={styles.messageText}>Requesting camera permission...</Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        {/* Minimal Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerContent}>
          <Icon name="camera-off" size={80} color="#EF4444" />
          <Text style={styles.messageTitle}>Camera Access Denied</Text>
          <Text style={styles.messageText}>
            Please enable camera access in settings to scan QR codes
          </Text>

          <TouchableOpacity style={styles.settingsButton} onPress={openSettings} activeOpacity={0.8}>
            <Icon name="cog" size={20} color="#FFFFFF" />
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Camera View - Full Screen */}
      <View style={styles.cameraContainer}>
        {/* Camera Placeholder */}
        <View style={styles.cameraPlaceholder}>
          <Icon name="camera" size={100} color="rgba(255, 255, 255, 0.15)" />
        </View>

        {/* Top Bar - Overlaid on Camera */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.topTitle}>Scan QR Code</Text>

          <TouchableOpacity
            style={[styles.topButton, flashEnabled && styles.topButtonActive]}
            onPress={handleFlashToggle}
            activeOpacity={0.7}
          >
            <Icon
              name={flashEnabled ? 'flash' : 'flash-off'}
              size={26}
              color={flashEnabled ? '#FFD700' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Scan Frame Overlay with Darkened Background */}
        <View style={styles.scanOverlay}>
          {/* Top Dim */}
          <View style={styles.dimArea} />

          {/* Middle Row with Frame */}
          <View style={styles.middleRow}>
            <View style={styles.dimArea} />
            <View style={styles.scanFrameContainer}>
              <View style={styles.scanFrame}>
                {/* Corner Markers */}
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />

                {/* Scanning Line */}
                <View style={styles.scanLine} />
              </View>
            </View>
            <View style={styles.dimArea} />
          </View>

          {/* Bottom Dim */}
          <View style={styles.dimArea} />
        </View>

        {/* Instructions - Minimal, Centered */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Position QR code within the frame
          </Text>
        </View>
      </View>

      {/* Bottom Panel - Semi-transparent */}
      <View style={styles.bottomPanel}>
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ReceiveMoney')}
            activeOpacity={0.7}
          >
            <View style={styles.actionIcon}>
              <Icon name="qrcode" size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.actionLabel}>My QR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleManualEntry}
            activeOpacity={0.7}
          >
            <View style={styles.actionIcon}>
              <Icon name="keyboard" size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.actionLabel}>Manual</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setScanned(false)}
            activeOpacity={0.7}
          >
            <View style={styles.actionIcon}>
              <Icon name="image" size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.actionLabel}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Top Bar - Minimal, Native Style
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10,
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  topButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },

  // Scan Overlay with Darkened Background
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dimArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanFrameContainer: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 240,
    height: 240,
    position: 'relative',
  },

  // Corner Markers - Native Style
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#FFFFFF',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 4,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },

  // Instructions - Minimal
  instructionsContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  instructionsText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Bottom Panel - Semi-transparent, Native Style
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(20px)',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: Spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // Permission States
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  messageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: Spacing.xl,
    minWidth: 180,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ScanQRScreen;
