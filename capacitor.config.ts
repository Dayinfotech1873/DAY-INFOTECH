import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dayinfotech.app',
  appName: 'DAY Infotech',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://ais-pre-aqx4kalvz6yd25bw3dujmj-686165071824.asia-southeast1.run.app',
    allowNavigation: [
      'ais-pre-aqx4kalvz6yd25bw3dujmj-686165071824.asia-southeast1.run.app'
    ]
  }
};

export default config;
