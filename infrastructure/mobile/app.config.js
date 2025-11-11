const path = require('path');
const dotenv = require('dotenv');

// Load .env file from the same directory as this config file
dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = {
  expo: {
    name: "ZabbixStore",
    slug: "zabbixstore",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.zabbixstore.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.zabbixstore.app"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-secure-store"
    ],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
      viacepApiUrl: process.env.EXPO_PUBLIC_VIACEP_API_URL || "https://viacep.com.br/ws",
      contactEmail: process.env.EXPO_PUBLIC_CONTACT_EMAIL || "contato@exemplo.com.br",
      googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || ""
    }
  }
};

