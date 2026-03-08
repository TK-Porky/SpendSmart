/**
 * Statistics Screen
 * Financial analysis with charts and category breakdown
 * Minimalist flat design with Modern Teal accent
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
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import DropdownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryCard from '../../components/CategoryCard';
import { SkeletonCard, SkeletonList, EmptyState, EmptyStatePresets } from '../../components';
import { Colors, Spacing, Radius, Shadows, Typography } from '../../constants';
import { formatCurrency } from '../../utils';

import { analysisService } from '../../services/AnalysisService';
import auth from '@react-native-firebase/auth';

const screenWidth = Dimensions.get('window').width;

const periods = [
  { label: 'Cette semaine', value: 'week' },
  { label: 'Ce mois', value: 'month' },
  { label: 'Cette année', value: 'year' },
  { label: 'Personnalisé', value: 'custom' },
];

const analysisTypes = [
  { label: 'Dépenses', value: 'expense' },
  { label: 'Revenus', value: 'income' },
  { label: 'Net (R-D)', value: 'net' },
];

function StatisticsScreen({ navigation }) {
  const [user, setUser] = useState(auth().currentUser);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [openAnalysisDropdown, setOpenAnalysisDropdown] = useState(false);
  const [openPeriodDropdown, setOpenPeriodDropdown] = useState(false);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('expense');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const [analysisDropdownItems, setAnalysisDropdownItems] = useState(analysisTypes);
  const [periodDropdownItems, setPeriodDropdownItems] = useState(periods);

  const [analysisData, setAnalysisData] = useState({
    categorySummary: [],
    dailyGraphData: { labels: [], datasets: [{ data: [] }] },
    totalAmountForPeriod: 0,
  });

  const [categoriesData, setCategoriesData] = useState([]);

  const fetchAnalysisData = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    setRefreshing(true);
    try {
      const data = await analysisService.getAnalysisData(user.uid, selectedPeriod, selectedAnalysisType);
      setAnalysisData(data);

      const categoryCards = data.categorySummary.map(item => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        name: item.name,
        description: `Total pour la période: ${formatCurrency(Math.abs(item.total))}`,
        amount: Math.abs(item.total),
        color: item.color,
        iconName: item.iconName
      }));
      setCategoriesData(categoryCards);

    } catch (error) {
      console.error("Erreur lors du chargement des données d'analyse:", error);
      setFallbackData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.uid, selectedPeriod, selectedAnalysisType, setFallbackData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setFallbackData = () => {
    if (selectedAnalysisType === 'expense') {
      setAnalysisData({
        categorySummary: [
          { id: 'cat1', name: 'Alimentation', total: 25000, color: Colors.error, iconName: 'food' },
          { id: 'cat2', name: 'Transport', total: 15000, color: Colors.primary.main, iconName: 'car' },
          { id: 'cat3', name: 'Divertissement', total: 10000, color: Colors.warning, iconName: 'movie' },
        ],
        dailyGraphData: {
          labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
          datasets: [{
            data: [2000, 4500, 2800, 8000, 9900, 4300, 6000],
            color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`
          }],
        },
        totalAmountForPeriod: 50000,
      });
      setCategoriesData([
        { id: 'cat1', name: 'Alimentation', description: 'Courses, restaurants', amount: 25000, color: Colors.error },
        { id: 'cat2', name: 'Transport', description: 'Bus, taxi, essence', amount: 15000, color: Colors.primary.main },
        { id: 'cat3', name: 'Divertissement', description: 'Films, sorties', amount: 10000, color: Colors.warning },
      ]);
    } else if (selectedAnalysisType === 'income') {
      setAnalysisData({
        categorySummary: [
          { id: 'cat4', name: 'Salaire', total: 100000, color: Colors.success, iconName: 'cash' },
          { id: 'cat5', name: 'Freelance', total: 25000, color: '#69DB7C', iconName: 'laptop' },
        ],
        dailyGraphData: {
          labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
          datasets: [{
            data: [10000, 20000, 15000, 30000, 25000, 40000],
            color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`
          }],
        },
        totalAmountForPeriod: 125000,
      });
      setCategoriesData([
        { id: 'cat4', name: 'Salaire', description: 'Revenu mensuel', amount: 100000, color: Colors.success },
        { id: 'cat5', name: 'Freelance', description: 'Projets secondaires', amount: 25000, color: '#69DB7C' },
      ]);
    }
  };

  useEffect(() => {
    fetchAnalysisData();
  }, [fetchAnalysisData]);

  const handleCategoryPress = (category) => {
    console.log("Catégorie sélectionnée:", category);
  };

  const onRefresh = useCallback(() => {
    fetchAnalysisData();
  }, [fetchAnalysisData]);

  const { categorySummary, dailyGraphData, totalAmountForPeriod } = analysisData;
  const userCurrency = 'XOF';

  const getAnalysisColor = () => {
    switch (selectedAnalysisType) {
      case 'expense': return Colors.error;
      case 'income': return Colors.success;
      case 'net': return Colors.primary.main;
      default: return Colors.primary.main;
    }
  };

  const chartConfig = {
    backgroundGradientFrom: Colors.background.card,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: Colors.background.card,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => {
      if (selectedAnalysisType === 'expense') return `rgba(239, 68, 68, ${opacity})`;
      if (selectedAnalysisType === 'income') return `rgba(34, 197, 94, ${opacity})`;
      return `rgba(13, 148, 136, ${opacity})`;
    },
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 11,
      fontWeight: 'bold',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: Colors.border.light,
    },
  };

  const getHeaderTitle = () => {
    switch (selectedAnalysisType) {
      case 'expense': return 'Analyse des Dépenses';
      case 'income': return 'Analyse des Revenus';
      case 'net': return 'Analyse Nette';
      default: return 'Analyse Financière';
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>{getHeaderTitle()}</Text>
          <View style={[styles.typeBadge, { backgroundColor: `${getAnalysisColor()}20` }]}>
            <Text style={[styles.typeBadgeText, { color: getAnalysisColor() }]}>
              {selectedAnalysisType === 'expense' ? 'Dépenses' : selectedAnalysisType === 'income' ? 'Revenus' : 'Net'}
            </Text>
          </View>
        </View>
        <View style={styles.contentWrapper}>
          <View style={{ marginTop: Spacing.lg }}>
            <SkeletonCard variant="balance" style={{ marginHorizontal: 0, marginBottom: Spacing.lg }} />
            <SkeletonList count={4} variant="transaction" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary.main]}
            tintColor={Colors.primary.main}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>{getHeaderTitle()}</Text>
          <View style={[styles.typeBadge, { backgroundColor: `${getAnalysisColor()}20` }]}>
            <Text style={[styles.typeBadgeText, { color: getAnalysisColor() }]}>
              {selectedAnalysisType === 'expense' ? 'Dépenses' : selectedAnalysisType === 'income' ? 'Revenus' : 'Net'}
            </Text>
          </View>
        </View>

        <View style={styles.contentWrapper}>
          {/* Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.dropdownWrapper}>
              <Text style={styles.dropdownLabel}>Type d'analyse</Text>
              <DropdownPicker
                open={openAnalysisDropdown}
                value={selectedAnalysisType}
                items={analysisDropdownItems}
                setOpen={setOpenAnalysisDropdown}
                setValue={setSelectedAnalysisType}
                setItems={setAnalysisDropdownItems}
                containerStyle={styles.pickerContainer}
                style={styles.pickerStyle}
                itemSeparatorStyle={styles.pickerItemSeparator}
                textStyle={styles.pickerTextStyle}
                dropDownContainerStyle={styles.dropdownListContainer}
                ArrowDownIconComponent={({ size, color }) => (
                  <Icon name="chevron-down" size={size || 20} color={Colors.text.secondary} />
                )}
                ArrowUpIconComponent={({ size, color }) => (
                  <Icon name="chevron-up" size={size || 20} color={Colors.text.secondary} />
                )}
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>

            <View style={styles.dropdownWrapper}>
              <Text style={styles.dropdownLabel}>Période</Text>
              <DropdownPicker
                open={openPeriodDropdown}
                value={selectedPeriod}
                items={periodDropdownItems}
                setOpen={setOpenPeriodDropdown}
                setValue={setSelectedPeriod}
                setItems={setPeriodDropdownItems}
                containerStyle={styles.pickerContainer}
                style={styles.pickerStyle}
                itemSeparatorStyle={styles.pickerItemSeparator}
                textStyle={styles.pickerTextStyle}
                dropDownContainerStyle={styles.dropdownListContainer}
                ArrowDownIconComponent={({ size, color }) => (
                  <Icon name="chevron-down" size={size || 20} color={Colors.text.secondary} />
                )}
                ArrowUpIconComponent={({ size, color }) => (
                  <Icon name="chevron-up" size={size || 20} color={Colors.text.secondary} />
                )}
                zIndex={2000}
                zIndexInverse={2000}
              />
            </View>
          </View>

          {/* Chart Section */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>
              Tendances {selectedAnalysisType === 'expense' ? 'de Dépenses' : selectedAnalysisType === 'income' ? 'de Revenus' : 'Nettes'}
            </Text>
            {dailyGraphData && dailyGraphData.datasets[0].data.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={dailyGraphData}
                  width={Math.max(screenWidth - 40, dailyGraphData.labels.length * 60)}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={chartConfig}
                  verticalLabelRotation={Platform.OS === 'android' ? 0 : -30}
                  fromZero={true}
                  showValuesOnTopOfBars={true}
                  withCustomBarColorFromData={true}
                  flatColor={true}
                  style={styles.chartStyle}
                />
              </ScrollView>
            ) : (
              <View style={styles.noDataContainer}>
                <Icon name="chart-bar" size={48} color={Colors.neutral[300]} />
                <Text style={styles.noDataText}>Pas de données pour le graphique sur cette période.</Text>
              </View>
            )}
            <View style={styles.totalAmountContainer}>
              <Text style={styles.totalAmountLabel}>Total pour la période:</Text>
              <Text style={[styles.totalAmountValue, { color: getAnalysisColor() }]}>
                {formatCurrency(totalAmountForPeriod, userCurrency)}
              </Text>
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionHeader}>Répartition par Catégorie</Text>

            {loading ? (
              <SkeletonList count={4} variant="transaction" />
            ) : categoriesData.length > 0 ? (
              <>
                <View style={styles.detailedCategoriesContainer}>
                  {categorySummary.map((item, index) => {
                    const percentage = totalAmountForPeriod !== 0 ? ((Math.abs(item.total) / Math.abs(totalAmountForPeriod)) * 100) : 0;
                    const isNegativeTotal = item.total < 0 && selectedAnalysisType === 'expense';
                    const displayAmount = isNegativeTotal ? `-${formatCurrency(Math.abs(item.total), userCurrency)}` : formatCurrency(item.total, userCurrency);

                    return (
                      <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => handleCategoryPress(item)}>
                        <View style={[styles.categoryIconContainer, { backgroundColor: item.color || Colors.primary.main }]}>
                          <Icon name={item.iconName || 'help-circle'} size={24} color={Colors.text.inverse} />
                        </View>
                        <View style={styles.categoryDetails}>
                          <Text style={styles.categoryName}>{item.name}</Text>
                          <View style={styles.categoryProgressBarContainer}>
                            <View style={[styles.categoryProgressBar, { width: `${percentage}%`, backgroundColor: item.color || Colors.primary.main }]} />
                          </View>
                        </View>
                        <View style={styles.categoryAmountContainer}>
                          <Text style={styles.categoryAmount}>{displayAmount}</Text>
                          <Text style={styles.categoryPercentage}>{percentage.toFixed(0)}%</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.cardsSubHeader}>Détail des catégories</Text>
                <FlatList
                  data={categoriesData}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <CategoryCard
                      category={item}
                      onPress={handleCategoryPress}
                    />
                  )}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              </>
            ) : (
              <EmptyState
                {...EmptyStatePresets.statistics}
                style={{ paddingVertical: 40 }}
              />
            )}
          </View>
        </View>
        <View style={{ height: 50 }} />
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
    backgroundColor: Colors.background.primary,
    paddingTop: Spacing.xl + Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
    flex: 1,
  },
  typeBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
  },
  typeBadgeText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  scrollViewContent: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  dropdownWrapper: {
    flex: 1,
  },
  dropdownLabel: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  pickerContainer: {
    height: 50,
  },
  pickerStyle: {
    backgroundColor: Colors.background.card,
    borderColor: Colors.border.light,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    ...Shadows.sm,
  },
  pickerTextStyle: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  dropdownListContainer: {
    borderColor: Colors.border.light,
    borderRadius: Radius.sm,
    marginTop: Spacing.xs,
    backgroundColor: Colors.background.card,
    ...Shadows.sm,
  },
  pickerItemSeparator: {
    height: 1,
    backgroundColor: Colors.border.light,
  },
  chartCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  chartTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
    textAlign: 'center',
    color: Colors.text.primary,
  },
  chartStyle: {
    borderRadius: Radius.lg,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl + Spacing.lg,
  },
  totalAmountContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  totalAmountLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  totalAmountValue: {
    ...Typography.h2,
  },
  categoriesSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    ...Typography.h3,
    marginBottom: Spacing.md,
    color: Colors.text.primary,
  },
  cardsSubHeader: {
    ...Typography.bodyBold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    color: Colors.text.secondary,
  },
  detailedCategoriesContainer: {
    marginBottom: Spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  categoryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  categoryProgressBarContainer: {
    height: 6,
    backgroundColor: Colors.neutral[200],
    borderRadius: Radius.xs,
    overflow: 'hidden',
  },
  categoryProgressBar: {
    height: '100%',
    borderRadius: Radius.xs,
  },
  categoryAmountContainer: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  categoryPercentage: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  noDataText: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: Spacing.md,
    color: Colors.text.secondary,
  },
});

export default StatisticsScreen;
