# How to Run SplitEase App

## Prerequisites

Before starting, make sure you have:
- **Node.js** v14 or higher installed
- **npm** or **yarn** installed
- **Expo CLI** (optional, but recommended)

To check your versions:
```bash
node --version
npm --version
```

## Installation Steps

### Step 1: Navigate to Project
```bash
cd c:\SplitEase\SplitEaseApp
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages:
- React Native components
- Navigation libraries
- State management (Zustand)
- Storage (AsyncStorage)
- And more...

**Wait time**: 2-5 minutes depending on connection

### Step 3: Start the App
```bash
npm start
```

You'll see output like:
```
Starting project at /path/to/SplitEaseApp
Expo server is ready at http://localhost:8081

 ▄▄▄▄▄ ▄▄▄▄▄   ▄▄▄▄▄
█ ███ █ █ ███ █ █ ███
█ ▀▀▀ █ █ █   █ █ █
█ ███ █ █ ███ █ █ ███
 ▄▄▄▄▄ ▄▄▄▄▄   ▄▄▄▄▄

Scan this with Expo Go

  Android | iOS
█████████████████████████████████████
█████████████████████████████████████
█████████████████████████████████████
█████████████████████████████████████

Use arrow keys to switch between clients
? › Press ? │ help
  a › open Android
  i › open iOS simulator
  w › open web
  j › open debugger
  r › reload app
  m › toggle menu
  p › toggle performance monitor
  shift+m › toggle dev menu

esc › exit
```

---

## Run on Different Platforms

### Option 1: Physical Device

#### iPhone
1. Open **Camera** app on your iPhone
2. Point at the QR code in terminal
3. Tap the notification to open in Expo Go

#### Android
1. Install **Expo Go** app from Google Play Store
2. Open Expo Go app
3. Tap **Scan QR code**
4. Point at the QR code in terminal
5. App will open automatically

### Option 2: Emulators

#### iOS Simulator
```bash
npm run ios
```
- Requires macOS with Xcode installed
- Automatically opens iOS simulator

#### Android Emulator
```bash
npm run android
```
- Requires Android Studio/Emulator
- Automatically opens Android emulator

### Option 3: Web Browser
```bash
npm run web
# OR press 'w' in the running terminal
```
- Opens in browser at http://localhost:8081
- Full functionality available
- Best for quick testing

---

## Development Workflow

### Keep Terminal Running
The `npm start` terminal should stay open while developing:
```bash
# Terminal 1 - Keep this running
npm start
```

### Make Changes
While the app is running:
1. Edit any file in `src/` folder
2. Save the file
3. Changes hot-reload automatically!
4. View changes on your device/emulator

### Reload App
- **Manual reload**: Press `r` in terminal
- **Full refresh**: Press `Ctrl+Shift+R`
- **Debug**: Press `d` in terminal

---

## Troubleshooting

### App Won't Start
```bash
# Clear cache and try again
npm start -- -c
```

### Dependency Issues
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
npm start
```

### Can't Connect to App
- Make sure phone/emulator and computer are on same network
- Try using `npm start` without Expo Go
- Check firewall isn't blocking port 8081

### Out of Memory (Android)
```bash
# Increase Node memory
export NODE_OPTIONS=--max_old_space_size=4096
npm start
```

---

## Available Commands

| Command | What It Does |
|---------|------------|
| `npm start` | Start development server with Expo |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |
| `npm run lint` | Check code for issues |

---

## First Time Usage

After the app opens:

1. **Create a Group**
   - Go to Groups tab
   - Tap + Create
   - Add name and members

2. **Add an Expense**
   - Go to + Add tab
   - Fill in the form
   - Tap Add Expense

3. **View Settlements**
   - Go to Settle tab
   - See who owes whom

---

## Tips

💡 **Use React Native Debugger** (optional)
```bash
npm install -g react-native-debugger
```

💡 **Access Developer Menu**
- iOS: Shake device or `Cmd+D` in simulator
- Android: Shake device or `Cmd+M` in emulator

💡 **View Logs**
- Terminal shows all console.log() messages
- Useful for debugging

💡 **Test on Multiple Devices**
```bash
# Keep npm start running
# Join from multiple devices via QR code
# See live sync across all devices
```

---

## Next Steps

1. ✅ Run the app with `npm start`
2. 📖 Read [QUICK_START.md](QUICK_START.md)
3. 📚 Read [README_SPLITEASE.md](README_SPLITEASE.md)
4. 🎨 Customize colors in component files
5. 🚀 Deploy to App Store/Play Store (advanced)

---

## Getting Help

- 🔗 [Expo Documentation](https://docs.expo.dev/)
- 🔗 [React Native Docs](https://reactnative.dev/)
- 🔗 [React Navigation](https://reactnavigation.org/)

---

**You're ready to go! Run `npm start` now!** 🎉
