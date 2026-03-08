/* eslint-disable react/no-unstable-nested-components */
/**
 * App Navigator
 * Modern navigation with floating bottom tab bar
 * @module navigation/AppNavigator
 */
import React from 'react';
import { View, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
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
import NotificationsScreen from '../screens/Main/NotificationsScreen';

// Detail screens
import TransactionDetailScreen from '../screens/Details/TransactionDetailScreen';
import AccountScreen from '../screens/Details/AccountScreen';

// Form screens
import AddTransactionScreen from '../screens/Forms/AddTransactionScreen';

// Settings screens
import SettingsScreen from '../screens/Settings/SettingsScreen';

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
        <MaterialCommunityIcons name="plus" size={28} color={Colors.text.inverse} />
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
    <HomeStack.Navigator
      screenOptions={defaultStackOptions}
      screenListeners={({ navigation }) => ({
        state: (e) => {
          // Hide tab bar on detail screens
          const routes = e.data.state.routes;
          const currentRoute = routes[routes.length - 1];

          if (currentRoute.name !== 'HomeDashboard') {
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'none' }
            });
          } else {
            navigation.getParent()?.setOptions({
              tabBarStyle: styles.tabBar
            });
          }
        }
      })}
    >
      <HomeStack.Screen
        name="HomeDashboard"
        component={HomeScreen}
      />
      <HomeStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={defaultStackOptions}
      />
      <HomeStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={defaultStackOptions}
      />
      <HomeStack.Screen
        name="AccountDetail"
        component={AccountScreen}
        options={defaultStackOptions}
      />
    </HomeStack.Navigator>
  );
}

function TransactionsStackScreen() {
  return (
    <TransactionsStack.Navigator
      screenOptions={defaultStackOptions}
      screenListeners={({ navigation }) => ({
        state: (e) => {
          const routes = e.data.state.routes;
          const currentRoute = routes[routes.length - 1];

          if (currentRoute.name !== 'TransactionsList') {
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'none' }
            });
          } else {
            navigation.getParent()?.setOptions({
              tabBarStyle: styles.tabBar
            });
          }
        }
      })}
    >
      <TransactionsStack.Screen
        name="TransactionsList"
        component={TransactionsScreen}
      />
      <TransactionsStack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={defaultStackOptions}
      />
      <TransactionsStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={defaultStackOptions}
      />
    </TransactionsStack.Navigator>
  );
}

function BudgetsStackScreen() {
  return (
    <BudgetsStack.Navigator
      screenOptions={defaultStackOptions}
      screenListeners={({ navigation }) => ({
        state: (e) => {
          const routes = e.data.state.routes;
          const currentRoute = routes[routes.length - 1];

          if (currentRoute.name !== 'BudgetsList') {
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'none' }
            });
          } else {
            navigation.getParent()?.setOptions({
              tabBarStyle: styles.tabBar
            });
          }
        }
      })}
    >
      <BudgetsStack.Screen
        name="BudgetsList"
        component={BudgetsScreen}
      />
      <BudgetsStack.Screen
        name="AccountDetail"
        component={AccountScreen}
        options={defaultStackOptions}
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
    </InsightStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      screenOptions={defaultStackOptions}
      screenListeners={({ navigation }) => ({
        state: (e) => {
          const routes = e.data.state.routes;
          const currentRoute = routes[routes.length - 1];

          if (currentRoute.name !== 'ProfileDetail') {
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'none' }
            });
          } else {
            navigation.getParent()?.setOptions({
              tabBarStyle: styles.tabBar
            });
          }
        }
      })}
    >
      <ProfileStack.Screen
        name="ProfileDetail"
        component={ProfileScreen}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={defaultStackOptions}
      />
    </ProfileStack.Navigator>
  );
}

// === TAB ICONS CONFIGURATION ===
const getTabBarIcon = (routeName, focused) => {
  const iconMap = {
    [TAB_NAMES.HOME]: focused ? 'home' : 'home-outline',
    [TAB_NAMES.TRANSACTIONS]: focused ? 'swap-horizontal' : 'swap-horizontal-outline',
    [TAB_NAMES.BUDGETS]: focused ? 'wallet' : 'wallet-outline',
    [TAB_NAMES.INSIGHT]: focused ? 'bar-chart' : 'bar-chart-outline',
    [TAB_NAMES.PROFILE]: focused ? 'person' : 'person-outline'
  };

  return iconMap[routeName];
};

// === CUSTOM TAB BAR ICON ===
const CustomTabBarIcon = ({ route, focused, color, size }) => {
  if (route.name === TAB_NAMES.QUICK_ADD) {
    return <CustomAddButton focused={focused} />;
  }

  const iconName = getTabBarIcon(route.name, focused);

  return (
    <View style={styles.iconContainer}>
      {focused && <View style={styles.activeIndicator} />}
      <Icon name={iconName} size={size} color={color} />
    </View>
  );
};

// === QUICK ADD HANDLER ===
const useQuickAddHandler = () => {
  const navigation = useNavigation();

  const handleQuickAdd = () => {
    const state = navigation.getState();
    const route = state.routes[state.index];

    // Quick add actions based on current tab
    const quickAddActions = {
      [TAB_NAMES.HOME]: () => {
        navigation.navigate(TAB_NAMES.TRANSACTIONS, {
          screen: 'AddTransaction',
        });
      },
      [TAB_NAMES.TRANSACTIONS]: () => {
        navigation.navigate(TAB_NAMES.TRANSACTIONS, {
          screen: 'AddTransaction',
        });
      },
      [TAB_NAMES.BUDGETS]: () => {
        navigation.navigate(TAB_NAMES.TRANSACTIONS, {
          screen: 'AddTransaction',
        });
      },
      [TAB_NAMES.INSIGHT]: () => {
        navigation.navigate(TAB_NAMES.TRANSACTIONS, {
          screen: 'AddTransaction',
        });
      },
      [TAB_NAMES.PROFILE]: () => {
        Alert.alert(
          'Quick Action',
          'What would you like to do?',
          [
            {
              text: 'Add Transaction',
              onPress: () => navigation.navigate(TAB_NAMES.TRANSACTIONS, {
                screen: 'AddTransaction',
              }),
            },
            {
              text: 'Add Budget',
              onPress: () => navigation.navigate(TAB_NAMES.BUDGETS, {
                screen: 'BudgetsList',
              }),
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      },
    };

    const action = quickAddActions[route.name];
    if (action) {
      action();
    } else {
      navigation.navigate(TAB_NAMES.TRANSACTIONS, {
        screen: 'AddTransaction',
      });
    }
  };

  return handleQuickAdd;
};

// === MAIN COMPONENT ===
function AppNavigator() {
  const handleQuickAdd = useQuickAddHandler();

  const screenOptions = ({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ focused, color, size }) => (
      <CustomTabBarIcon route={route} focused={focused} color={color} size={size} />
    ),
    tabBarActiveTintColor: Colors.primary.main,
    tabBarInactiveTintColor: Colors.neutral[400],
    tabBarStyle: styles.tabBar,
    tabBarLabelStyle: styles.tabBarLabel,
    tabBarItemStyle: styles.tabBarItem,
    tabBarAccessibilityLabel: route.name,
    tabBarShowLabel: true,
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={TAB_NAMES.HOME}
        component={HomeStackScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name={TAB_NAMES.TRANSACTIONS}
        component={TransactionsStackScreen}
        options={{ tabBarLabel: 'Transactions' }}
      />
      <Tab.Screen
        name={TAB_NAMES.QUICK_ADD}
        component={HomeStackScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleQuickAdd();
          },
        }}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen
        name={TAB_NAMES.BUDGETS}
        component={BudgetsStackScreen}
        options={{ tabBarLabel: 'Budgets' }}
      />
      <Tab.Screen
        name={TAB_NAMES.PROFILE}
        component={ProfileStackScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 16,
    left: 16,
    right: 16,
    height: Platform.OS === 'ios' ? 72 : 64,
    backgroundColor: Colors.background.primary,
    borderRadius: Radius.lg,
    borderTopWidth: 0,
    paddingTop: Spacing.xs,
    paddingBottom: Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
    paddingHorizontal: Spacing.xs,
    ...Shadows.lg,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: -2,
    marginBottom: 4,
  },
  tabBarItem: {
    paddingVertical: Spacing.xs,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary.main,
  },
});

const customButtonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary.main,
    ...Shadows.lg,
    elevation: 8,
  },
  focusedButton: {
    backgroundColor: Colors.primary.dark,
    transform: [{ scale: 1.05 }],
  },
});

export default AppNavigator;
