import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

/**
 * Helper to render components with React Navigation context
 * @param {React.Component} component - Component to render
 * @param {Object} options - Navigation options
 * @returns {Object} Render result with navigation utilities
 */
export const renderWithNavigation = (component, options = {}) => {
  const { initialRouteName = 'Test', screenOptions = {} } = options;

  const TestNavigator = () => (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={screenOptions}
      >
        <Stack.Screen
          name="Test"
          component={() => component}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

  return render(<TestNavigator />);
};

export default renderWithNavigation;

