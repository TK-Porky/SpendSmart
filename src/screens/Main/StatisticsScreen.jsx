/**
 * StatisticsScreen
 * Modern financial insights with charts and analytics
 * @module screens/Main/StatisticsScreen
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  SkeletonList,
  EmptyState,
  EmptyStatePresets,
  MonthSelector,
} from '../../components';
import { Colors, Spacing, Radius, Shadows } from '../../constants';
import { formatCurrency } from '../../utils';
import { analysisService } from '../../services/AnalysisService';
import auth from '@react-native-firebase/auth';

const screenWidth = Dimensions.get('window').width;

const ANALYSIS_TYPES = [
  { id: 'expense', label: 'Expenses', icon: 'arrow-up', color: '#EF4444' },
  { id: 'income', label: 'Income', icon: 'arrow-down', color: '#10B981' },
  { id: 'net', label: 'Net', icon: 'chart-line', color: '#3B82F6' },
];

function StatisticsScreen({ navigation }) {
  const [user] = useState(auth().currentUser);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedAnalysisType, setSelectedAnalysisType] = useState('expense');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [analysisData, setAnalysisData] = useState({
    categorySummary: [],
    dailyGraphData: { labels: [], datasets: [{ data: [] }] },
    totalAmountForPeriod: 0,
  });

  const fetchAnalysisData = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const data = await analysisService.getAnalysisData(
        user.uid,
        'month',
        selectedAnalysisType
      );
      setAnalysisData(data);
    } catch (error) {
      console.error('Error loading analysis data:', error);
      setFallbackData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid, selectedAnalysisType]);

  const setFallbackData = () => {
    if (selectedAnalysisType === 'expense') {
      setAnalysisData({
        categorySummary: [
          { id: 'cat1', name: 'Food & Dining', total: 25000, color: '#F59E0B', iconName: 'food' },
          { id: 'cat2', name: 'Transportation', total: 15000, color: '#3B82F6', iconName: 'car' },
          { id: 'cat3', name: 'Entertainment', total: 10000, color: '#EC4899', iconName: 'movie' },
          { id: 'cat4', name: 'Shopping', total: 8000, color: '#8B5CF6', iconName: 'shopping' },
        ],
        dailyGraphData: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{ data: [12000, 15000, 18000, 13000] }],
        },
        totalAmountForPeriod: 58000,
      });
    } else if (selectedAnalysisType === 'income') {
      setAnalysisData({
        categorySummary: [
          { id: 'cat4', name: 'Salary', total: 100000, color: '#10B981', iconName: 'cash' },
          { id: 'cat5', name: 'Freelance', total: 25000, color: '#06B6D4', iconName: 'laptop' },
        ],
        dailyGraphData: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{ data: [25000, 30000, 35000, 35000] }],
        },
        totalAmountForPeriod: 125000,
      });
    } else {
      setAnalysisData({
        categorySummary: [],
        dailyGraphData: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{ data: [13000, 15000, 17000, 22000] }],
        },
        totalAmountForPeriod: 67000,
      });
    }
  };

  useEffect(() => {
    fetchAnalysisData();
  }, [fetchAnalysisData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnalysisData();
  }, [fetchAnalysisData]);

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const getGradientColors = () => {
    switch (selectedAnalysisType) {
      case 'expense':
        return ['#EF4444', '#DC2626'];
      case 'income':
        return ['#10B981', '#059669'];
      case 'net':
        return ['#3B82F6', '#2563EB'];
      default:
        return ['#8B5CF6', '#7C3AED'];
    }
  };

  const getAnalysisColor = () => {
    return ANALYSIS_TYPES.find((t) => t.id === selectedAnalysisType)?.color || '#8B5CF6';
  };

  const chartConfig = {
    backgroundGradientFrom: Colors.background.card,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: Colors.background.card,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `${getAnalysisColor()}${Math.round(opacity * 255).toString(16)}`,
    labelColor: () => Colors.text.secondary,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 12,
      fontWeight: '600',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: Colors.border.light,
      strokeWidth: 1,
    },
  };

  const { categorySummary, dailyGraphData, totalAmountForPeriod } = analysisData;

  const renderHeader = () => (
    <LinearGradient colors={getGradientColors()} style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Icon name="arrow-left" size={24} color={Colors.text.inverse} />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Financial Insights</Text>
        <Text style={styles.headerSubtitle}>Track your spending patterns</Text>
      </View>

      <View style={styles.headerSpacer} />
    </LinearGradient>
  );

  const renderAnalysisTypeSelector = () => (
    <View style={styles.analysisTypeContainer}>
      {ANALYSIS_TYPES.map((type) => (
        <TouchableOpacity
          key={type.id}
          style={[
            styles.analysisTypeChip,
            selectedAnalysisType === type.id && [
              styles.analysisTypeChipActive,
              { backgroundColor: `${type.color}15`, borderColor: type.color },
            ],
          ]}
          onPress={() => setSelectedAnalysisType(type.id)}
          activeOpacity={0.7}
        >
          <Icon
            name={type.icon}
            size={18}
            color={selectedAnalysisType === type.id ? type.color : Colors.text.secondary}
          />
          <Text
            style={[
              styles.analysisTypeText,
              selectedAnalysisType === type.id && { color: type.color },
            ]}
          >
            {type.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverviewCard = () => (
    <View style={styles.overviewCard}>
      <View style={styles.overviewHeader}>
        <View style={[styles.overviewIcon, { backgroundColor: `${getAnalysisColor()}15` }]}>
          <Icon
            name={ANALYSIS_TYPES.find((t) => t.id === selectedAnalysisType)?.icon || 'chart-bar'}
            size={28}
            color={getAnalysisColor()}
          />
        </View>
        <View style={styles.overviewInfo}>
          <Text style={styles.overviewLabel}>
            Total {ANALYSIS_TYPES.find((t) => t.id === selectedAnalysisType)?.label}
          </Text>
          <Text style={[styles.overviewAmount, { color: getAnalysisColor() }]}>
            {formatCurrency(totalAmountForPeriod)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderChart = () => (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Trends</Text>
        <View style={[styles.chartBadge, { backgroundColor: `${getAnalysisColor()}15` }]}>
          <Text style={[styles.chartBadgeText, { color: getAnalysisColor() }]}>Monthly</Text>
        </View>
      </View>

      {dailyGraphData && dailyGraphData.datasets[0].data.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={dailyGraphData}
            width={Math.max(screenWidth - 80, dailyGraphData.labels.length * 80)}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            style={styles.chart}
          />
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Icon name="chart-bar-stacked" size={48} color={Colors.border.light} />
          <Text style={styles.noDataText}>No data available for this period</Text>
        </View>
      )}
    </View>
  );

  const renderCategories = () => {
    if (categorySummary.length === 0) {
      return (
        <EmptyState
          {...EmptyStatePresets.statistics}
          style={{ paddingVertical: 40 }}
        />
      );
    }

    return (
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>

        {categorySummary.map((item, index) => {
          const percentage =
            totalAmountForPeriod !== 0
              ? (Math.abs(item.total) / Math.abs(totalAmountForPeriod)) * 100
              : 0;

          return (
            <TouchableOpacity key={index} style={styles.categoryItem} activeOpacity={0.7}>
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: item.color || Colors.primary.main },
                ]}
              >
                <Icon name={item.iconName || 'help-circle'} size={22} color={Colors.text.inverse} />
              </View>

              <View style={styles.categoryContent}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{item.name}</Text>
                  <Text style={styles.categoryAmount}>{formatCurrency(Math.abs(item.total))}</Text>
                </View>

                <View style={styles.categoryFooter}>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${percentage}%`,
                          backgroundColor: item.color || Colors.primary.main,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.categoryPercentage}>{percentage.toFixed(0)}%</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.content}>
          <SkeletonList count={5} variant="transaction" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[getAnalysisColor()]}
            tintColor={getAnalysisColor()}
          />
        }
      >
        <View style={styles.content}>
          <MonthSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={handleMonthChange}
          />

          {renderAnalysisTypeSelector()}
          {renderOverviewCard()}
          {renderChart()}
          {renderCategories()}

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl + Spacing.md : Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCenter: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.inverse,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: Spacing.md,
  },
  analysisTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  analysisTypeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background.card,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.sm,
  },
  analysisTypeChipActive: {
    // Applied dynamically with color
  },
  analysisTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  overviewCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  overviewIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewInfo: {
    flex: 1,
  },
  overviewLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  overviewAmount: {
    fontSize: 28,
    fontWeight: '700',
  },
  chartCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  chartBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  chartBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chart: {
    marginVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  noDataText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  categoriesSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  categoryContent: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  categoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.background.secondary,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: Radius.full,
  },
  categoryPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    minWidth: 40,
    textAlign: 'right',
  },
  bottomSpacer: {
    height: 120,
  },
});

export default StatisticsScreen;
