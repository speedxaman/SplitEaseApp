// Premium gradient definitions for Cred-style UI
export const Gradients = {
  // Premium purple-to-gold gradients
  primaryGold: ['#5B21B6', '#F59E0B'],
  primaryShiny: ['#7C3AED', '#5B21B6'],
  
  // Cyan accents
  coolTone: ['#06B6D4', '#0891B2'],
  
  // Soft gradients for cards
  softLight: ['#FFFFFF', '#F0F3FF'],
  softDark: ['#1A1F3A', '#252D4D'],
  
  // Background gradients
  backgroundLight: ['#FAFBFC', '#F5F7FB'],
  backgroundDark: ['#0A0E27', '#1A1F3A'],
  
  // Status gradients
  successGradient: ['#10B981', '#6EE7B7'],
  dangerGradient: ['#EF4444', '#FCA5A5'],
  warningGradient: ['#F59E0B', '#FCD34D'],
};

// Shine effect for premium look
export const ShineEffect = {
  position: 'absolute',
  top: 0,
  left: '-100%',
  width: '100%',
  height: '100%',
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
  animation: 'shine 3s infinite',
};
