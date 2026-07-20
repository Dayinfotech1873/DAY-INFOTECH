import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dayinfotech.app',
  appName: 'DAY Infotech',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
