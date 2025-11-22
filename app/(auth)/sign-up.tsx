import { Button } from '@/components/Button';
import { GlassView } from '@/components/GlassView';
import { Input } from '@/components/Input';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function SignUp() {
  const { signUp, isLoading, error, clearError } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      // Ideally show an error here, but for now relying on store error handling or simple alert if needed
      // But let's just let the store handle it if we want to be consistent, or add local validation
      // For this task, I'll assume the store handles validation or I should add a local check.
      // Adding a local check for password match:
      if (password !== confirmPassword) {
        alert("Passwords don't match"); // Simple alert for now, or could set a local error state
        return;
      }
    }
    const success = await signUp(username, password);
    if (success) {
      // Navigation is handled automatically
    }
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    if (error) clearError();
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
      }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInUp.delay(200).duration(1000).springify()}>
            <GlassView style={styles.card} intensity={40}>
              <View style={styles.header}>
                <ThemedText type="largeTitle" style={styles.title}>
                  Create Account
                </ThemedText>
                <ThemedText type="subtitle" style={styles.subtitle}>
                  Join us today
                </ThemedText>
              </View>

              {error && (
                <View style={styles.errorContainer}>
                  <ThemedText style={styles.errorText}>{error.message}</ThemedText>
                </View>
              )}

              <View style={styles.form}>
                <Input
                  label="Username"
                  value={username}
                  onChangeText={handleUsernameChange}
                  placeholder="Choose a username"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  error={error?.field === 'username' ? 'Username taken' : undefined}
                />

                <Input
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Choose a password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />

                <Input
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />

                <Button
                  title="Sign Up"
                  onPress={handleSignUp}
                  isLoading={isLoading}
                  style={styles.button}
                  size="lg"
                />
              </View>

              <View style={styles.footer}>
                <ThemedText style={styles.footerText}>Already have an account?</ThemedText>
                <Link href="/sign-in" asChild>
                  <Button title="Sign In" variant="ghost" size="sm" onPress={() => {}} />
                </Link>
              </View>
            </GlassView>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Layout.spacing.lg,
  },
  card: {
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.xl,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  header: {
    marginBottom: Layout.spacing.xl,
    alignItems: 'center',
  },
  title: {
    marginBottom: Layout.spacing.xs,
    textAlign: 'center',
    color: Colors.dark.text,
  },
  subtitle: {
    textAlign: 'center',
    color: Colors.dark.textSecondary,
    fontWeight: 'normal',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.2)',
  },
  errorText: {
    color: Colors.dark.error,
    textAlign: 'center',
    fontSize: 14,
  },
  form: {
    marginBottom: Layout.spacing.xl,
  },
  button: {
    marginTop: Layout.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    color: Colors.dark.textSecondary,
  },
});
