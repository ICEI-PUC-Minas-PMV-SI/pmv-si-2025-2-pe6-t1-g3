import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { userService } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { colors, spacing } from '../../theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Toast from 'react-native-toast-message';
import SecureStore from '../../services/secureStore';

const ProfileScreen = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    CODPES: '',
    NOME: '',
    SOBRENOME: '',
    CPF: '',
    TELEFONE: '',
    EMAIL: '',
  });
  const [userPassword, setUserPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const response = await userService.getProfile(decodedToken.CODPES);
        const userProfile = response.data;
        setUserData({
          CODPES: userProfile.CODPES,
          NOME: userProfile.NOME,
          SOBRENOME: userProfile.SOBRENOME,
          CPF: userProfile.CPF,
          TELEFONE: userProfile.TELEFONE,
          EMAIL: userProfile.USUARIO?.EMAIL || userProfile.EMAIL,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao buscar dados',
        text2: 'Tente mais tarde',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setUserData({ ...userData, [name]: value });
  };

  const handlePasswordChange = (name, value) => {
    setUserPassword({ ...userPassword, [name]: value });
    if (passwordError) {
      setPasswordError('');
    }
  };

  const updateData = async () => {
    setIsLoading(true);
    try {
      await userService.updateProfile(userData);
      Toast.show({
        type: 'success',
        text1: 'Dados atualizados com sucesso!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar',
        text2: 'Tente mais tarde',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async () => {
    if (!userPassword.oldPassword || !userPassword.newPassword || !userPassword.confirmPassword) {
      setPasswordError('Todos os campos são obrigatórios');
      return;
    }

    if (userPassword.newPassword.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (userPassword.newPassword !== userPassword.confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    setPasswordError('');

    try {
      await userService.changePassword({
        oldPassword: userPassword.oldPassword,
        newPassword: userPassword.newPassword,
      });

      Toast.show({
        type: 'success',
        text1: 'Senha alterada com sucesso!',
      });

      setUserPassword({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao alterar senha';
      setPasswordError(errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Erro ao alterar senha',
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          <Input
            label="Nome"
            placeholder="Seu primeiro nome"
            value={userData.NOME}
            onChangeText={(value) => handleChange('NOME', value)}
            required
          />

          <Input
            label="Sobrenome"
            placeholder="Seu sobrenome"
            value={userData.SOBRENOME}
            onChangeText={(value) => handleChange('SOBRENOME', value)}
            required
          />

          <Input
            label="CPF"
            placeholder="000.000.000-00"
            value={userData.CPF}
            onChangeText={(value) => handleChange('CPF', value)}
            required
          />

          <Input
            label="Telefone"
            type="phone"
            placeholder="(11) 99999-9999"
            value={userData.TELEFONE}
            onChangeText={(value) => handleChange('TELEFONE', value)}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={userData.EMAIL}
            onChangeText={(value) => handleChange('EMAIL', value)}
            required
          />

          <Button
            variant="primary"
            size="large"
            onPress={updateData}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
          >
            Salvar Alterações
          </Button>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alterar Senha</Text>
          
          <Input
            label="Senha Atual"
            type="password"
            placeholder="Digite sua senha atual"
            value={userPassword.oldPassword}
            onChangeText={(value) => handlePasswordChange('oldPassword', value)}
            required
          />

          <Input
            label="Nova Senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={userPassword.newPassword}
            onChangeText={(value) => handlePasswordChange('newPassword', value)}
            required
          />

          <Input
            label="Confirmar Nova Senha"
            type="password"
            placeholder="Digite a nova senha novamente"
            value={userPassword.confirmPassword}
            onChangeText={(value) => handlePasswordChange('confirmPassword', value)}
            error={passwordError}
            required
          />

          <Button
            variant="primary"
            size="large"
            onPress={changePassword}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
          >
            Alterar Senha
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});

export default ProfileScreen;

