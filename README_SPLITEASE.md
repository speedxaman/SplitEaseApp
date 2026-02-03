# SplitEase - React Native Expense Splitting App

A Splitwise-like mobile application built with React Native and Expo for tracking and splitting expenses among groups.

## Features

✅ **Create Groups** - Organize expenses by groups (roommates, trips, friends, etc.)
✅ **Add Expenses** - Record who paid and how to split the cost
✅ **Multiple Split Types** - Split equally among group members
✅ **Automatic Calculations** - Get instant settlement suggestions
✅ **Track Balances** - See who owes whom at a glance
✅ **Data Persistence** - All data saved locally on device
✅ **Settlement Tracking** - View all necessary payments to settle debts

## Project Structure

```
SplitEaseApp/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js          # Display all expenses
│   │   ├── AddExpenseScreen.js    # Add new expenses
│   │   ├── GroupsScreen.js        # Manage groups
│   │   └── SettleScreen.js        # View settlements
│   ├── components/
│   │   └── ExpenseComponents.js   # Reusable UI components
│   ├── store/
│   │   └── expenseStore.js        # Zustand state management
│   └── utils/
│       └── calculateSplits.js     # Expense calculation logic
├── App.js                         # Navigation setup
├── app.json                       # Expo configuration
└── package.json                  # Dependencies
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Setup

1. **Install dependencies**
```bash
cd SplitEaseApp
npm install
```

2. **Start the app**
```bash
npm start
```

3. **Run on your device**
   - **iOS**: Press `i` in terminal or scan QR code with Camera app
   - **Android**: Press `a` in terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in terminal

## Core Technologies

- **React Native + Expo** - Cross-platform mobile development
- **React Navigation** - Bottom tab navigation
- **Zustand** - Lightweight state management
- **AsyncStorage** - Local data persistence
- **UUID** - Unique identifier generation

## Key Components

### State Management (expenseStore.js)
- Manages expenses, groups, and balances
- Handles data persistence with AsyncStorage
- Provides actions for CRUD operations

### Calculation Engine (calculateSplits.js)
- **calculateBalances()** - Computes each member's balance
- **calculateSettlements()** - Generates optimal payment settlements
- **formatCurrency()** - Currency formatting utility

### UI Components (ExpenseComponents.js)
- `ExpenseItem` - Individual expense display
- `GroupCard` - Group display card
- `SettlementItem` - Settlement suggestion
- `MemberItem` - Group member display
- `BalanceCard` - User balance indicator

## How to Use

### 1. Create a Group
- Go to **Groups** tab
- Tap **+ Create**
- Enter group name
- Add members (at least 2)
- Tap **Create Group**

### 2. Add an Expense
- Go to **Expenses** tab or **+ Add** tab
- Select a group
- Enter expense description
- Enter amount
- Select who paid
- Select who should split the cost
- Tap **Add Expense**

### 3. View Settlements
- Go to **Settle** tab
- Select a group
- See individual balances
- View settlement suggestions
- When balance = $0, users are settled up

### 4. Example Workflow

**Scenario**: 3 roommates (Alice, Bob, Charlie)

1. Alice pays $30 for dinner, everyone eats
   - Balance: Alice +$20, Bob -$10, Charlie -$10

2. Bob pays $20 for groceries, everyone uses
   - Balance: Alice +$13.33, Bob -$10, Charlie -$3.33

3. Settlement needed: Charlie pays Alice $3.33, Bob pays Alice $13.33

## Data Structure

### Expense Object
```javascript
{
  id: "uuid",
  description: "Dinner",
  amount: 30,
  paidBy: "user-id",
  groupId: "group-id",
  splitBetween: ["user-id-1", "user-id-2"],
  date: "2026-02-03T19:00:00Z"
}
```

### Group Object
```javascript
{
  id: "uuid",
  name: "Roommates",
  members: [
    { id: "uuid", name: "Alice" },
    { id: "uuid", name: "Bob" }
  ],
  createdAt: "2026-02-03T19:00:00Z"
}
```

## Available Scripts

```bash
npm start          # Start Expo server
npm run android    # Start on Android emulator
npm run ios        # Start on iOS simulator
npm run web        # Start web version
npm run lint       # Run linting checks
```

## Troubleshooting

### App won't start
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Clear Expo cache: `expo start -c`

### Data not persisting
- Check AsyncStorage is initialized
- Try clearing app data and restarting

### Navigation not working
- Ensure all required dependencies are installed
- Check import paths are correct

## Future Enhancements

- 📱 Add expense photos/receipts
- 👥 User authentication
- 📊 Expense statistics and charts
- 💬 Chat/comments on expenses
- 📤 Export/share settlement reports
- 🏦 Integration with payment apps
- 🌙 Dark mode support

## License

MIT License - Feel free to use this project for personal or commercial use.

## Support

For issues or questions, refer to:
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)

---

Happy splitting! 🎉
