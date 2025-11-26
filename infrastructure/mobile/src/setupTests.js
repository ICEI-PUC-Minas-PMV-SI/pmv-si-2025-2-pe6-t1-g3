import '@testing-library/jest-native/extend-expect';

// MSW server setup (only if MSW is available)
// Check if msw/node is available before trying to use it
let mswAvailable = false;
try {
  require.resolve('msw/node');
  mswAvailable = true;
} catch (error) {
  // MSW/node not available, skip setup silently
  // This is expected in some test environments (e.g., React Native)
}

if (mswAvailable) {
  try {
    const { server } = require('./__tests__/mocks/server');
    
    // Start MSW server before all tests
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
    
    // Reset handlers after each test
    afterEach(() => server.resetHandlers());
    
    // Clean up after all tests
    afterAll(() => server.close());
  } catch (error) {
    // Server setup failed, skip silently
  }
}

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  isAvailable: jest.fn(() => true), // Por padrão, SecureStore está disponível nos testes
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        apiUrl: 'http://localhost:3000',
        viacepApiUrl: 'https://viacep.com.br/ws',
        contactEmail: 'contato@exemplo.com.br',
        googleClientId: '',
      },
    },
  },
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
      setOptions: jest.fn(),
      addListener: jest.fn(),
      isFocused: jest.fn(() => true),
    }),
    useRoute: () => ({
      params: {},
    }),
    useFocusEffect: jest.fn(),
  };
});

// Mock React Navigation Bottom Tabs
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: jest.fn(() => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  })),
}));

// Mock React Navigation Native Stack
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: jest.fn(() => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  })),
}));

// jest-expo already mocks react-native completely, don't mock it again
// This was causing the loop issue

// Mock Toast
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
  setRef: jest.fn(),
}));

// Mock expo-vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
  FontAwesome: 'FontAwesome',
  AntDesign: 'AntDesign',
  Entypo: 'Entypo',
  Feather: 'Feather',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn((el) => el),
    Directions: {},
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  screensEnabled: jest.fn(() => true),
}));
