/* eslint-disable react/no-unstable-nested-components */
/**
 * App Navigator
 * Main navigation configuration with bottom tabs and stack navigators
 * @module navigation/AppNavigator
 */
import React from 'react';
import { View, TouchableOpacity, Alert, StyleSheet, Text, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Radius, Shadows } from '../constants';

// Main screens
import HomeScreen from '../screens/Main/HomeScreen';
import TransactionsScreen from '../screens/Main/TransactionsScreen';
import BudgetsScreen from '../screens/Main/BudgetsScreen';
import StatisticsScreen from '../screens/Main/StatisticsScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';

// === PLACEHOLDER SCREENS ===
const AddTransactionScreen = () => (
  <View style={placeholderStyles.container}>
    <Text style={placeholderStyles.text}>Page Ajout Transaction</Text>
  </View>
);

const AddBudgetScreen = () => (
  <View style={placeholderStyles.container}>
    <Text style={placeholderStyles.text}>Page Ajout Budget</Text>
  </View>
);

const AddInsightDataScreen = () => (
  <View style={placeholderStyles.container}>
    <Text style={placeholderStyles.text}>Page Ajout Donnée Insight</Text>
  </View>
);

// === CUSTOM ADD BUTTON ===
const CustomAddButton = ({ focused }) => {
  return (
    <TouchableOpacity
      style={customButtonStyles.container}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Ajouter"
      accessibilityHint="Ouvre le menu d'ajout rapide"
    >
      <View style={[customButtonStyles.button, focused && customButtonStyles.focusedButton]}>
        <MaterialCommunityIcons name="plus" size={24} color={Colors.text.inverse} />
      </View>
    </TouchableOpacity>
  );
};

// === CONSTANTS ===
const TAB_NAMES = {
  HOME: 'Accueil',
  TRANSACTIONS: 'Transactions',
  QUICK_ADD: 'QuickAdd',
  BUDGETS: 'Budgets',
  INSIGHT: 'Insight',
  PROFILE: 'Profile'
};

// === STACK CREATORS ===
const HomeStack = createStackNavigator();
const TransactionsStack = createStackNavigator();
const BudgetsStack = createStackNavigator();
const InsightStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// === SCREEN CONFIGURATIONS ===
const defaultStackOptions = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
};

const modalStackOptions = {
  headerShown: true,
  cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
  gestureEnabled: true,
  gestureDirection: 'vertical',
  headerStyle: {
    backgroundColor: Colors.background.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: Colors.text.primary,
  headerTitleStyle: {
    fontWeight: '600',
  },
};

// === STACK COMPONENTS ===
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={defaultStackOptions}>
      <HomeStack.Screen
        name="HomeDashboard"
        component={HomeScreen}
      />
      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ ...defaultStackOptions, title: 'Détails du Compte' }}
      />
      <HomeStack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{ ...modalStackOptions, title: 'Nouvelle Transaction' }}
      />
    </HomeStack.Navigator>
  );
}

function TransactionsStackScreen() {
  return (
    <TransactionsStack.Navigator screenOptions={defaultStackOptions}>
      <TransactionsStack.Screen
        name="TransactionsList"
        component={TransactionsScreen}
      />
      <TransactionsStack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{ ...modalStackOptions, title: 'Nouvelle Transaction' }}
      />
    </TransactionsStack.Navigator>
  );
}

function BudgetsStackScreen() {
  return (
    <BudgetsStack.Navigator screenOptions={defaultStackOptions}>
      <BudgetsStack.Screen
        name="BudgetsList"
        component={BudgetsScreen}
      />
      <BudgetsStack.Screen
        name="AddBudget"
        component={AddBudgetScreen}
        options={{ ...modalStackOptions, title: 'Nouveau Budget' }}
      />
    </BudgetsStack.Navigator>
  );
}

function InsightStackScreen() {
  return (
    <InsightStack.Navigator screenOptions={defaultStackOptions}>
      <InsightStack.Screen
        name="InsightOverview"
        component={StatisticsScreen}
      />
      <InsightStack.Screen
        name="AddInsightData"
        component={AddInsightDataScreen}
        options={{ ...modalStackOptions, title: 'Ajouter Données' }}
      />
    </InsightStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={defaultStackOptions}>
      <ProfileStack.Screen
        name="ProfileDetail"
        component={ProfileScreen}
      />
    </ProfileStack.Navigator>
  );
}

// === TAB ICONS CONFIGURATION ===
const getTabBarIcon = (routeName, focused) => {
  const iconMap = {
    [TAB_NAMES.HOME]: focused ? 'home' : 'home-outline',
    [TAB_NAMES.TRANSACTIONS]: focused ? 'swap-horizontal' : 'swap-horizontal-outline',
    [TAB_NAMES.BUDGETS]: focused ? 'cash' : 'cash-outline',
    [TAB_NAMES.INSIGHT]: focused ? 'stats-chart' : 'stats-chart-outline',
    [TAB_NAMES.PROFILE]: focused ? 'person' : 'person-outline'
  };

  return iconMap[routeName];
};

// === QUICK ADD HANDLER ===
const useQuickAddHandler = () => {
  const navigation = useNavigation();

  const handleQuickAdd = () => {
    const state = navigation.getState();
    const route = state.routes[state.index];

    const quickAddActions = {
      [TAB_NAMES.HOME]: () => {
        navigation.navigate(TAB_NAMES.HOME, { screen: 'AddTransaction' });
      },
      [TAB_NAMES.TRANSACTIONS]: () => {
        navigation.navigate(TAB_NAMES.TRANSACTIONS, { screen: 'AddTransaction' });
      },
      [TAB_NAMES.BUDGETS]: () => {
        navigation.navigate(TAB_NAMES.BUDGETS, { screen: 'AddBudget' });
      },
      [TAB_NAMES.INSIGHT]: () => {
        navigation.navigate(TAB_NAMES.INSIGHT, { screen: 'AddInsightData' });
      },
      [TAB_NAMES.PROFILE]: () => {
        Alert.alert("Action rapide", "Pas d'action rapide définie pour le profil.");
      }
    };

    const action = quickAddActions[route.name];
    if (action) {
      action();
    } else {
      Alert.alert("Action rapide", "Aucune action définie pour cet écran.");
    }
  };

  return handleQuickAdd;
};

// === MAIN COMPONENT ===
function AppNavigator() {
  const handleQuickAdd = useQuickAddHandler();

  const screenOptions = ({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ focused, color, size }) => {
      if (route.name === TAB_NAMES.QUICK_ADD) {
        return <CustomAddButton focused={focused} />;
      }

      const iconName = getTabBarIcon(route.name, focused);
      return <Icon name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: Colors.primary.main,
    tabBarInactiveTintColor: Colors.neutral[400],
    tabBarStyle: styles.tabBar,
    tabBarLabelStyle: styles.tabBarLabel,
    tabBarAccessibilityLabel: route.name,
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={TAB_NAMES.HOME}
        component={HomeStackScreen}
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen
        name={TAB_NAMES.TRANSACTIONS}
        component={TransactionsStackScreen}
        options={{ tabBarLabel: 'Transactions' }}
      />
      <Tab.Screen
        name={TAB_NAMES.BUDGETS}
        component={BudgetsStackScreen}
        options={{ tabBarLabel: 'Budgets' }}
      />
      <Tab.Screen
        name={TAB_NAMES.INSIGHT}
        component={InsightStackScreen}
        options={{ tabBarLabel: 'Analyse' }}
      />
      <Tab.Screen
        name={TAB_NAMES.PROFILE}
        component={ProfileStackScreen}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 88 : 64,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.xs,
    paddingBottom: Platform.OS === 'ios' ? Spacing.lg : Spacing.sm,
    ...Shadows.sm,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: -Spacing.xs,
  }
});

const customButtonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 52,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary.main,
    ...Shadows.sm,
  },
  focusedButton: {
    backgroundColor: Colors.primary.dark,
  },
});

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.secondary,
  },
});

export default AppNavigator;
