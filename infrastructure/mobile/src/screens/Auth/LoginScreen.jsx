import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors, spacing } from '../../theme';
import Toast from 'react-native-toast-message';

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    EMAIL: '',
    SENHA: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.EMAIL) {
      errors.EMAIL = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.EMAIL)) {
      errors.EMAIL = 'Email inválido';
    }

    if (!formData.SENHA) {
      errors.SENHA = 'Senha é obrigatória';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      const response = await authService.login(formData);
      await login(response.data.token);
      // Navigation will be handled automatically by AppNavigator based on auth state
    } catch (error) {
      const message =
        error.response?.data?.message || 'Não foi possível fazer login.';
      setGeneralError(message);
      Toast.show({
        type: 'error',
        text1: 'Erro ao fazer login',
        text2: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.subtitle}>Acesse sua conta</Text>
          </View>

          {generalError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{generalError}</Text>
            </View>
          )}

          <View style={styles.form}>
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={formData.EMAIL}
              onChangeText={(value) => handleChange('EMAIL', value)}
              error={fieldErrors.EMAIL}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              value={formData.SENHA}
              onChangeText={(value) => handleChange('SENHA', value)}
              error={fieldErrors.SENHA}
              required
            />

            <Button
              variant="primary"
              size="large"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitButton}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Não tem uma conta?{' '}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('Register')}
              >
                Cadastre-se
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.gray900,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray600,
  },
  errorContainer: {
    borderWidth: 1,
    borderColor: colors.red200,
    backgroundColor: colors.red50,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.red700,
  },
  form: {
    marginBottom: spacing.lg,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  footer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.gray600,
  },
  link: {
    color: colors.gray900,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default LoginScreen;

