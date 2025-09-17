# 📱 TalentPool Mobile Setup Guide

This guide will help you set up and build the TalentPool app for mobile devices using Capacitor.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation
```bash
# Install dependencies
npm install

# Build and sync with Capacitor
npm run mobile:build
```

## 📱 Available Commands

### Development Commands
```bash
# Build web assets and sync with Capacitor
npm run mobile:build

# Open Android Studio
npm run mobile:android

# Open Xcode (macOS only)
npm run mobile:ios

# Sync only (after making changes)
npm run mobile:sync
```

### Manual Commands
```bash
# Build web assets
npm run build

# Sync with Capacitor
npx cap sync

# Open Android Studio
npx cap open android

# Open Xcode
npx cap open ios
```

## 🔧 Configuration

### App Configuration
- **App ID**: `com.paristat.talentpool`
- **App Name**: `talentpool:-hiring-platform`
- **Theme Color**: `#0ea5e9` (Cyan)
- **Background Color**: `#f8fafc` (Light) / `#0f172a` (Dark)

### Capacitor Configuration
The app is configured in `capacitor.config.ts`:
- Splash screen duration: 2 seconds
- Status bar style: Dark
- Android scheme: HTTPS

## 📱 Mobile Features

### Responsive Design
- Touch-friendly button sizes (44px minimum)
- Mobile-optimized forms (16px font size to prevent iOS zoom)
- Safe area handling for notched devices
- Mobile-specific animations and transitions

### PWA Features
- Standalone app experience
- Offline capability
- App-like navigation
- Mobile-optimized icons and splash screens

### Platform Detection
The app automatically detects:
- Mobile devices
- Capacitor environment
- Android/iOS platforms
- Touch interactions

## 🏗️ Building for Production

### Android APK
1. Run `npm run mobile:android`
2. In Android Studio:
   - Go to Build → Generate Signed Bundle/APK
   - Choose APK
   - Create a new keystore or use existing
   - Build the APK

### iOS App
1. Run `npm run mobile:ios`
2. In Xcode:
   - Select your development team
   - Choose a device or simulator
   - Build and run

## 📋 App Store Preparation

### Required Assets
- App icons (192x192, 512x512)
- Splash screens
- App store screenshots
- App description and metadata

### Google Play Store
- Minimum SDK: 22 (Android 5.1)
- Target SDK: 34 (Android 14)
- App bundle format recommended

### Apple App Store
- iOS 13.0 minimum
- App Store Connect setup required
- TestFlight for beta testing

## 🐛 Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist android ios
npm install
npm run mobile:build
```

**Sync issues:**
```bash
# Force sync
npx cap sync --force
```

**Android Studio not opening:**
- Ensure Android Studio is installed
- Check that ANDROID_HOME is set
- Verify Java/JDK installation

**iOS build issues:**
- Ensure Xcode is installed
- Check Apple Developer account
- Verify provisioning profiles

### Development Tips

1. **Hot Reload**: Use `npm run dev` for web development
2. **Mobile Testing**: Use `npm run mobile:android` for Android testing
3. **Debugging**: Use Chrome DevTools for web debugging
4. **Performance**: Monitor bundle size and loading times

## 📚 Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Development Guide](https://developer.android.com/guide)
- [iOS Development Guide](https://developer.apple.com/ios/)
- [PWA Best Practices](https://web.dev/pwa-checklist/)

## 🎯 Next Steps

1. **Test on real devices** - Install APK on Android device
2. **Add native features** - Camera, GPS, push notifications
3. **Optimize performance** - Bundle size, loading times
4. **App store submission** - Prepare metadata and assets
5. **Beta testing** - TestFlight (iOS) / Internal testing (Android)

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Capacitor documentation
3. Check platform-specific guides
4. Test on multiple devices

---

**Happy mobile development! 🚀**
