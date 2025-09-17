import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.paristat.talentpool',
  appName: 'TalentPool',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0ea5e9",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0ea5e9'
    }
  }
};

export default config;
