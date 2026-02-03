# Quick Start Guide - SplitEase

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd c:\SplitEase\SplitEaseApp
npm install
```

### Step 2: Start the App
```bash
npm start
```

You'll see a QR code in the terminal.

### Step 3: Open on Your Device

**iPhone:**
- Open Camera app
- Scan the QR code
- Tap notification to open in Expo Go

**Android:**
- Open Expo Go app (install from Play Store if needed)
- Tap "Scan QR code"
- Scan the QR code

**Web Browser:**
- Press `w` in the terminal

## First Time Usage

### 1️⃣ Create Your First Group
1. Tap the **Groups** tab at the bottom
2. Tap **+ Create** button
3. Enter group name (e.g., "Weekend Trip")
4. Add members (minimum 2):
   - Type name and press **Add**
   - Add all members
5. Tap **Create Group**

### 2️⃣ Add Your First Expense
1. Tap **+ Add** tab at the bottom
2. Select your group from the list
3. Enter expense details:
   - **Description**: What you bought (e.g., "Lunch")
   - **Amount**: How much it cost (e.g., 45.00)
   - **Paid By**: Who paid (select one person)
   - **Split Between**: Who should pay (select multiple)
4. Tap **Add Expense**

### 3️⃣ View Settlements
1. Tap **Settle** tab at the bottom
2. Select your group
3. See individual balances:
   - Green = People owe you money
   - Red = You owe money
4. Check "Settlements Needed" section:
   - Shows exact who-pays-who transactions

### 4️⃣ Add More Expenses
1. Go to **Expenses** tab to see all expenses
2. Tap **+ Add** to add more
3. Watch balances update automatically in **Settle** tab

## Example Scenario

### Setup: 3 Friends Trip
- Alice, Bob, Charlie

### Expense 1: Hotel
- Alice paid $300
- Split equally: Alice +$200, Bob -$100, Charlie -$100

### Expense 2: Gas
- Bob paid $60
- Split equally: Alice -$20, Bob +$40, Charlie -$20

### Result
- Alice: +$180 (owed)
- Bob: -$60 (owes)
- Charlie: -$120 (owes)

### Settlements
1. Bob pays Alice $60
2. Charlie pays Alice $120

## Tips

💡 **Tip 1**: Add all expenses first, then settle at the end
💡 **Tip 2**: You can delete expenses if you make mistakes
💡 **Tip 3**: Data is saved automatically on your phone
💡 **Tip 4**: Create separate groups for different occasions

## Common Issues

### Q: How do I delete an expense?
A: Go to **Expenses** tab, tap the **✕** button on any expense

### Q: How do I delete a group?
A: Go to **Groups** tab, tap **Delete** button on any group

### Q: Where is my data saved?
A: All data is stored locally on your phone using AsyncStorage

### Q: Can I use this on multiple devices?
A: Currently data is device-specific. Each device has its own database.

## Need Help?

- 📖 Read full documentation in `README_SPLITEASE.md`
- 🔄 Try refreshing the app (close and reopen)
- 🗑️ Clear all data and start fresh in future versions

---

**You're all set!** Start splitting expenses now! 🎉
