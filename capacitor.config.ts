import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dayinfotech.app',
  appName: 'DAY Infotech',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Commented out the remote URL so that the app serves the built UI files locally from the APK assets.
    // This gives a true 100% native feel and prevents the app from redirecting to external Chrome browser on startup.
    // url: 'https://ais-pre-aqx4kalvz6yd25bw3dujmj-686165071824.asia-southeast1.run.app',
    allowNavigation: [
      '*',
      'ais-pre-aqx4kalvz6yd25bw3dujmj-686165071824.asia-southeast1.run.app',
      'ais-dev-aqx4kalvz6yd25bw3dujmj-686165071824.asia-southeast1.run.app'
    ]
  }
};

export default config;
