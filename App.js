import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useExpenseStore } from './src/store/expenseStore';
import { ThemeProvider, useTheme } from './src/utils/ThemeContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { AddExpenseScreen } from './src/screens/AddExpenseScreen';
import { GroupsScreen } from './src/screens/GroupsScreen';
import { SettleScreen } from './src/screens/SettleScreen';
import { GroupDetailScreen } from './src/screens/GroupDetailScreen';
import { Colors, Shadows } from './src/utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeList" component={HomeScreen} />
      <Stack.Screen
        name="ExpenseDetail"
        component={ExpenseDetailScreen}
        options={{ headerShown: true, title: 'Expense Details' }}
      />
    </Stack.Navigator>
  );
}

function GroupsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="GroupsList" component={GroupsScreen} />
      <Stack.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
        options={{ headerShown: true, title: 'Group Details' }}
      />
    </Stack.Navigator>
  );
}

function AddExpenseStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        title: 'Add Expense',
        headerStyle: {
          backgroundColor: theme.bg.secondary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: theme.text.primary,
          fontSize: 18,
        },
        headerTintColor: Colors.primary,
      }}
    >
      <Stack.Screen name="AddExpenseForm" component={AddExpenseScreen} />
    </Stack.Navigator>
  );
}

function SettleStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SettleList" component={SettleScreen} />
    </Stack.Navigator>
  );
}

// Placeholder screen for expense details
function ExpenseDetailScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Expense Details</Text>
    </View>
  );
}

export default function App() {
  const loadData = useExpenseStore(state => state.loadData);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Groups') {
              iconName = focused ? 'account-multiple' : 'account-multiple-outline';
            } else if (route.name === 'AddExpense') {
              iconName = focused ? 'plus-circle' : 'plus-circle-outline';
            } else if (route.name === 'Settle') {
              iconName = focused ? 'check-circle' : 'check-circle-outline';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: theme.text.tertiary,
          tabBarStyle: {
            backgroundColor: theme.bg.secondary,
            borderTopColor: theme.border,
            borderTopWidth: 1,
            paddingBottom: 4,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            title: 'Expenses',
          }}
        />
        <Tab.Screen
          name="Groups"
          component={GroupsStack}
          options={{
            title: 'Groups',
          }}
        />
        <Tab.Screen
          name="AddExpense"
          component={AddExpenseStack}
          options={{
            title: 'Add',
          }}
        />
        <Tab.Screen
          name="Settle"
          component={SettleStack}
          options={{
            title: 'Settle',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
