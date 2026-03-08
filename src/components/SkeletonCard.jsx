/**
 * Skeleton Card Component
 * Placeholder loading animation for cards
 * @module components/SkeletonCard
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants';

const SkeletonCard = ({ style, variant = 'transaction' }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  const variants = {
    transaction: (
      <View style={styles.row}>
        <Animated.View style={[styles.circle, { opacity }]} />
        <View style={styles.content}>
          <Animated.View style={[styles.line, styles.lineShort, { opacity }]} />
          <Animated.View style={[styles.line, styles.lineMedium, { opacity }]} />
        </View>
        <Animated.View style={[styles.amount, { opacity }]} />
      </View>
    ),
    balance: (
      <View style={styles.balanceCard}>
        <Animated.View style={[styles.line, styles.lineShort, { opacity }]} />
        <Animated.View style={[styles.balanceAmount, { opacity }]} />
        <View style={styles.balanceRow}>
          <Animated.View style={[styles.balanceItem, { opacity }]} />
          <Animated.View style={[styles.balanceItem, { opacity }]} />
        </View>
      </View>
    ),
    budget: (
      <View style={styles.row}>
        <View style={styles.content}>
          <Animated.View style={[styles.line, styles.lineMedium, { opacity }]} />
          <Animated.View style={[styles.progressBar, { opacity }]} />
        </View>
        <Animated.View style={[styles.amount, { opacity }]} />
      </View>
    ),
  };

  return <View style={[styles.card, style]}>{variants[variant]}</View>;
};

export const SkeletonList = ({ count = 5, variant = 'transaction' }) => (
  <View>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} variant={variant} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.background.card, borderRadius: 10, padding: 15, marginHorizontal: 20, marginVertical: 5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  circle: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.border.light, marginRight: 15 },
  content: { flex: 1 },
  line: { height: 12, borderRadius: 6, backgroundColor: Colors.border.light, marginBottom: 8 },
  lineShort: { width: '40%' },
  lineMedium: { width: '70%' },
  amount: { width: 60, height: 16, borderRadius: 8, backgroundColor: Colors.border.light },
  progressBar: { height: 8, borderRadius: 4, backgroundColor: Colors.border.light, width: '100%' },
  balanceCard: { padding: 10 },
  balanceAmount: { height: 32, width: '60%', borderRadius: 8, backgroundColor: Colors.border.light, marginVertical: 12 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  balanceItem: { width: '45%', height: 40, borderRadius: 8, backgroundColor: Colors.border.light },
});

export default SkeletonCard;
