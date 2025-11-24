import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors, spacing } from '../../theme';
import Toast from 'react-native-toast-message';
import { TouchableOpacity } from 'react-native';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    NOME: '',
    SOBRENOME: '',
    EMAIL: '',
    CPF: '',
    TELEFONE: '',
    SENHA: '',
    confSenha: '',
  });
  const [isFornecedor, setIsFornecedor] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      navigation.navigate('Login');
    }
  }, [user, navigation]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.NOME) {
      newErrors.NOME = 'Nome é obrigatório';
    }

    if (!formData.SOBRENOME) {
      newErrors.SOBRENOME = 'Sobrenome é obrigatório';
    }

    if (!formData.EMAIL) {
      newErrors.EMAIL = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.EMAIL)) {
      newErrors.EMAIL = 'Email inválido';
    }

    if (!formData.CPF) {
      newErrors.CPF = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/.test(formData.CPF)) {
      newErrors.CPF = 'CPF inválido';
    }

    if (!formData.TELEFONE) {
      newErrors.TELEFONE = 'Telefone é obrigatório';
    }

    if (!formData.SENHA) {
      newErrors.SENHA = 'Senha é obrigatória';
    } else if (formData.SENHA.length < 6) {
      newErrors.SENHA = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confSenha) {
      newErrors.confSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.SENHA !== formData.confSenha) {
      newErrors.confSenha = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { confSenha, ...registerData } = formData;
      if (isFornecedor) {
        registerData.PERMISSAO = 'FORNECEDOR';
      }
      await authService.register(registerData);

      Toast.show({
        type: 'success',
        text1: 'Cadastro realizado!',
        text2: 'Redirecionando para login...',
      });

      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar usuário';

      if (error.response?.status === 409) {
        errorMessage = 'Email já está sendo usado';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setErrors({
        general: { message: errorMessage, type: 'error' },
      });

      Toast.show({
        type: 'error',
        text1: 'Erro ao cadastrar',
        text2: errorMessage,
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
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Cadastre-se para acessar a loja</Text>
          </View>

          {errors.general && (
            <View
              style={[
                styles.messageContainer,
                errors.general.type === 'success'
                  ? styles.successContainer
                  : styles.errorContainer,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  errors.general.type === 'success'
                    ? styles.successText
                    : styles.errorText,
                ]}
              >
                {errors.general.message}
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações Pessoais</Text>
              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Input
                    label="Nome"
                    placeholder="Seu primeiro nome"
                    value={formData.NOME}
                    onChangeText={(value) => handleChange('NOME', value)}
                    error={errors.NOME}
                    required
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Input
                    label="Sobrenome"
                    placeholder="Seu sobrenome"
                    value={formData.SOBRENOME}
                    onChangeText={(value) => handleChange('SOBRENOME', value)}
                    error={errors.SOBRENOME}
                    required
                  />
                </View>
              </View>

              <Input
                label="CPF"
                placeholder="000.000.000-00"
                value={formData.CPF}
                onChangeText={(value) => handleChange('CPF', value)}
                error={errors.CPF}
                required
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contato</Text>
              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.EMAIL}
                    onChangeText={(value) => handleChange('EMAIL', value)}
                    error={errors.EMAIL}
                    required
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Input
                    label="Telefone"
                    type="phone"
                    placeholder="(11) 99999-9999"
                    value={formData.TELEFONE}
                    onChangeText={(value) => handleChange('TELEFONE', value)}
                    error={errors.TELEFONE}
                    required
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Segurança</Text>
              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Input
                    label="Senha"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.SENHA}
                    onChangeText={(value) => handleChange('SENHA', value)}
                    error={errors.SENHA}
                    required
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Input
                    label="Confirmar Senha"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={formData.confSenha}
                    onChangeText={(value) => handleChange('confSenha', value)}
                    error={errors.confSenha}
                    required
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tipo de Conta</Text>
                <TouchableOpacity
                  style={styles.fornecedorRow}
                  onPress={() => setIsFornecedor((v) => !v)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, isFornecedor && styles.checkboxChecked]} />
                  <Text style={styles.fornecedorText}>Registrar como fornecedor</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button
              variant="primary"
              size="large"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitButton}
            >
              {isLoading ? 'Cadastrando...' : 'Criar Conta'}
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Já tem uma conta?{' '}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('Login')}
              >
                Fazer login
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
    padding: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  content: {
    width: '100%',
    maxWidth: 600,
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
  messageContainer: {
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 8,
  },
  successContainer: {
    borderColor: colors.black,
    backgroundColor: colors.black,
  },
  errorContainer: {
    borderColor: colors.gray300,
    backgroundColor: colors.gray50,
  },
  successText: {
    color: colors.white,
    fontSize: 14,
  },
  errorText: {
    color: colors.gray900,
    fontSize: 14,
  },
  messageText: {
    fontSize: 14,
  },
  form: {
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray900,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  fornecedorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray300,
    marginRight: spacing.md,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  fornecedorText: {
    fontSize: 14,
    color: colors.gray900,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
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

export default RegisterScreen;

