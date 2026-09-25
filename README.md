# StockMate — Expo React Native App

A full conversion of the StockMate inventory/business management UI into a
runnable, buildable Expo React Native project (Android + iOS).

## What's inside

```
StockMate/
├── App.js                      # Entry point: providers, lock screen, navigation
├── app.json                    # Expo config (name, icons, Android package id)
├── eas.json                    # EAS Build profiles (used to build the APK)
├── babel.config.js
├── package.json
├── assets/                     # App icon / splash (placeholders — swap these)
└── src/
    ├── theme/themes.js         # All 6 color themes (light, dark, midnight, emerald, amoled, sunset)
    ├── data/mockData.js        # Seed data (products, sales, purchases, expenses, investors, loans...)
    ├── utils/format.js         # Currency formatting, id generation
    ├── context/AppContext.js   # Global state (theme, currency, all business data) + AsyncStorage persistence
    ├── components/             # Icon (SVG), charts, Card/MetricCard/SearchBar/FormField, BottomModal
    ├── navigation/AppNavigator.js  # Bottom tabs (Home/Stock/Sales/Reports/More) + stack screens
    └── screens/                # All 14 screens (Dashboard, Inventory, Sales, Analytics, Purchases,
                                 # Backup, Expenses, Investors, Loans, LentMoney, Reports,
                                 # ThemeSettings, More, LockScreen)
```

## Run it locally

```bash
cd StockMate
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (Android/iOS) or press `a` to open
an Android emulator, `i` for iOS simulator.

## Build an installable APK

This project is preconfigured for [EAS Build](https://docs.expo.dev/build/introduction/),
Expo's cloud build service (no local Android Studio setup required).

```bash
npm install -g eas-cli
eas login                 # create a free Expo account if you don't have one
eas build:configure       # links this project to your Expo account, sets the projectId
eas build -p android --profile preview
```

The `preview` profile in `eas.json` is set to output a `.apk` directly
(rather than an `.aab` bundle), so you'll get a download link for an APK you
can side-load onto any Android device.

If you'd rather build locally with Android Studio installed:

```bash
npx expo prebuild -p android
cd android && ./gradlew assembleRelease
# APK will be at android/app/build/outputs/apk/release/app-release.apk
```

## Notes on the conversion

- The original was a single-file web React app using `div`/inline `style`
  and inline SVG icons. Everything has been rebuilt with React Native
  primitives (`View`, `Text`, `TextInput`, `TouchableOpacity`, `ScrollView`,
  `Modal`) and `react-native-svg` for icons and charts.
- All business logic (adding products, recording sales, tracking expenses,
  investors, loans, money lent, stock in/out, profit math) is real and
  wired through `src/context/AppContext.js`, not placeholder UI.
- State is persisted to the device with `AsyncStorage`, so data survives
  an app restart.
- Replace `assets/icon.png`, `assets/adaptive-icon.png`, and
  `assets/splash.png` with your real artwork before shipping — the ones
  included are solid-color placeholders.
- Update `android.package` and `ios.bundleIdentifier` in `app.json` to your
  own reverse-domain identifier before publishing.
