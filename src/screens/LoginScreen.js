import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../utils/AuthContext';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../utils/theme';

WebBrowser.maybeCompleteAuthSession();

// IMPORTANT: Replace with your Google OAuth Client ID from Google Cloud Console
// Get it from: https://console.cloud.google.com/
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_DISCOVERY_DOCUMENT = 'https://www.googleapis.com/discovery/v1/apis/oauth2/v1/rest';

export const LoginScreen = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [request, response, promptAsync] = React.useMemo(() => {
    // Only setup Google OAuth on native platforms
    if (Platform.OS !== 'web') {
      const result = AuthSession.useAuthRequest(
        {
          clientId: GOOGLE_CLIENT_ID,
          scopes: ['profile', 'email'],
          redirectUrl: AuthSession.getRedirectUrl(),
        },
        { discovery: GOOGLE_DISCOVERY_DOCUMENT }
      );
      return result;
    }
    return [null, null, null];
  }, []);

  // Handle Google OAuth response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        handleGoogleSuccess(id_token);
      }
    }
  }, [response]);

  const handleGoogleSuccess = async (idToken) => {
    try {
      setIsLoading(true);
      
      // Decode the JWT token to extract user info
      const decoded = decodeJWT(idToken);
      
      if (!decoded) {
        throw new Error('Failed to decode token');
      }

      const userData = {
        id: decoded.sub,
        name: decoded.name || 'User',
        email: decoded.email,
        picture: decoded.picture,
      };

      const success = await login(userData);
      if (!success) {
        Alert.alert('Error', 'Failed to save user data');
      }
    } catch (error) {
      console.error('Google Sign-in failed:', error);
      Alert.alert('Google Sign-in Error', error.message || 'An error occurred during sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Google Sign-in is not available in web mode. Use "Try Demo" instead.');
      return;
    }

    if (!request) {
      Alert.alert('Error', 'Google Sign-in is not configured yet');
      return;
    }

    try {
      const result = await promptAsync();
      if (result?.type !== 'success') {
        console.log('Google sign-in cancelled');
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      Alert.alert('Google Sign-in Error', error.message);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setIsLoading(true);
      const demoUser = {
        id: 'demo-user-' + Math.random(),
        name: 'Demo User',
        email: 'demo@splitease.app',
        picture: 'https://via.placeholder.com/150',
      };
      const success = await login(demoUser);
      if (!success) {
        console.error('Failed to save user data');
      }
    } catch (error) {
      console.error('Demo login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.white }]}>
      <View style={styles.content}>
        {/* Logo/Header */}
        <View style={styles.headerSection}>
          <View style={[styles.logoContainer, { backgroundColor: Colors.primary }]}>
            <MaterialCommunityIcons name="cash-multiple" size={64} color={Colors.accent} />
          </View>
          <Text style={[styles.appName, { color: Colors.primary }]}>SplitEase</Text>
          <Text style={[styles.appSubtitle, { color: Colors.gray500 }]}>
            Smart expense splitting made easy
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <FeatureCard
            icon="account-multiple"
            title="Split Bills"
            description="Easily split expenses with friends and groups"
          />
          <FeatureCard
            icon="chart-line"
            title="Track Spending"
            description="Keep track of who paid what and who owes whom"
          />
          <FeatureCard
            icon="check-circle"
            title="Settle Up"
            description="Calculate settlements and get clear payment instructions"
          />
        </View>

        {/* Auth Buttons */}
        <View style={styles.authSection}>
          {/* Google Sign-In Button */}
          <TouchableOpacity
            style={[styles.googleButton, { backgroundColor: Colors.white }]}
            onPress={handleGoogleSignIn}
            disabled={isLoading || !request}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
              <>
                <MaterialCommunityIcons name="google" size={24} color={Colors.primary} />
                <Text style={[styles.googleButtonText, { color: Colors.primary }]}>
                  Sign in with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Demo Login Button */}
          <TouchableOpacity
            style={[styles.demoButton, { backgroundColor: Colors.primary }]}
            onPress={handleDemoLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <MaterialCommunityIcons name="play" size={20} color={Colors.white} />
                <Text style={styles.demoButtonText}>Try Demo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={[styles.footerText, { color: Colors.gray500 }]}>
            By signing in, you agree to our{' '}
            <Text style={{ color: Colors.primary, fontWeight: '700' }}>Terms of Service</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

// Helper function to decode JWT without verification (client-side only)
// In production, always verify the token on your backend
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

const FeatureCard = ({ icon, title, description }) => (
  <View style={[styles.featureCard, { backgroundColor: Colors.gray50 }]}>
    <MaterialCommunityIcons
      name={icon}
      size={32}
      color={Colors.accent}
      style={styles.featureIcon}
    />
    <Text style={[styles.featureTitle, { color: Colors.primary }]}>{title}</Text>
    <Text style={[styles.featureDescription, { color: Colors.gray500 }]}>
      {description}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    marginTop: Spacing.xl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.lg,
    borderTopWidth: 3,
    borderTopColor: Colors.accent,
  },
  appName: {
    ...Typography.h1,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  appSubtitle: {
    ...Typography.bodySmall,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  featuresSection: {
    marginBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  featureCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: Colors.accent,
    ...Shadows.md,
  },
  featureIcon: {
    marginBottom: Spacing.md,
  },
  featureTitle: {
    ...Typography.h4,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  featureDescription: {
    ...Typography.bodySmall,
    textAlign: 'center',
  },
  authSection: {
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  googleButton: {
    flexDirection: 'row',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  googleButtonText: {
    ...Typography.button,
    fontWeight: '700',
  },
  demoButton: {
    flexDirection: 'row',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.lg,
    borderTopWidth: 2,
    borderTopColor: Colors.accent,
  },
  demoButtonText: {
    ...Typography.button,
    color: Colors.white,
    fontWeight: '700',
  },
  footerSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  footerText: {
    ...Typography.caption,
    textAlign: 'center',
    lineHeight: 18,
  },
});
