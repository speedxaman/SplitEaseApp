/**
 * Calculate how much each person owes
 * @param {Array} expenses - List of all expenses
 * @param {Array} members - List of group members
 * @returns {Object} Balances for each member
 */
export const calculateBalances = (expenses, members = []) => {
  const balances = {};
  
  // Initialize balances
  members.forEach(member => {
    balances[member.id || member] = 0;
  });

  // Process each expense
  expenses.forEach(expense => {
    if (!expense.paidBy) return;

    const splitAmount = expense.amount / expense.splitBetween.length;

    // Credit the person who paid
    balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;

    // Debit each person who should pay
    expense.splitBetween.forEach(memberId => {
      balances[memberId] = (balances[memberId] || 0) - splitAmount;
    });
  });

  return balances;
};

/**
 * Calculate who owes whom
 * @param {Object} balances - Balance sheet
 * @returns {Array} Array of settlements needed
 */
export const calculateSettlements = (balances) => {
  const settlements = [];
  const debtors = [];
  const creditors = [];

  // Separate debtors and creditors
  Object.entries(balances).forEach(([person, balance]) => {
    if (balance < 0) {
      debtors.push({ person, amount: Math.abs(balance) });
    } else if (balance > 0) {
      creditors.push({ person, amount: balance });
    }
  });

  // Match debtors with creditors
  while (debtors.length > 0 && creditors.length > 0) {
    const debtor = debtors[0];
    const creditor = creditors[0];

    const settlementAmount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.person,
      to: creditor.person,
      amount: settlementAmount.toFixed(2),
    });

    debtor.amount -= settlementAmount;
    creditor.amount -= settlementAmount;

    if (debtor.amount === 0) debtors.shift();
    if (creditor.amount === 0) creditors.shift();
  }

  return settlements;
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return `₹${parseFloat(amount).toFixed(2)}`;
};

/**
 * Format date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get user's net balance
 */
export const getUserBalance = (userId, balances) => {
  return balances[userId] || 0;
};

/**
 * Check if user owes money
 */
export const userOwesBalance = (userId, balances) => {
  const balance = getUserBalance(userId, balances);
  return balance < 0 ? Math.abs(balance) : 0;
};

/**
 * Check if user is owed money
 */
export const userIsOwedBalance = (userId, balances) => {
  const balance = getUserBalance(userId, balances);
  return balance > 0 ? balance : 0;
};
