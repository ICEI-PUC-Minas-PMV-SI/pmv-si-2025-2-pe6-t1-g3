import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { userService, addressService, externalService } from '../../services/api';
import { colors, spacing } from '../../theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { ENV } from '../../utils/env';

const AddressScreen = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [addressInfo, setAddressInfo] = useState({
    CODPES: '',
    CODEND: '',
    CEP: '',
    LOGRADOURO: '',
    BAIRRO: '',
    CIDADE: '',
    COMPLEMENTO: '',
    NUMERO: '',
    UF: '',
    DESCRICAO: '',
  });
  const [cep, setCep] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editedAddress, setEditedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cep.length === 9) {
        fetchCEP();
      }
    }, ENV.CEP_FETCH_DELAY_MS());

    return () => clearTimeout(timer);
  }, [cep]);

  const fetchUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const response = await userService.getProfile(decodedToken.CODPES);
        const userData = response.data;
        setAddresses(userData.ENDERECOS || []);
        setAddressInfo({ ...addressInfo, CODPES: userData.CODPES });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao buscar dados',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCEP = async () => {
    try {
      const response = await externalService.getCep(cep);
      const data = response.data;

      setAddressInfo((prev) => ({
        ...prev,
        CEP: data.cep || '',
        LOGRADOURO: data.logradouro || '',
        BAIRRO: data.bairro || '',
        CIDADE: data.localidade || '',
        UF: data.uf || '',
      }));
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao buscar CEP',
        text2: 'Tente mais tarde',
      });
    }
  };

  const handleChange = (name, value) => {
    if (name === 'CEP') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 5) {
        formattedValue = formattedValue.replace(/^(\d{5})(\d{0,3})/, '$1-$2');
      }
      setCep(formattedValue);
      setAddressInfo({ ...addressInfo, CEP: formattedValue });
    } else {
      setAddressInfo({ ...addressInfo, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!addressInfo.LOGRADOURO || !addressInfo.NUMERO || !addressInfo.BAIRRO || !addressInfo.CIDADE || !addressInfo.UF) {
      Toast.show({
        type: 'error',
        text1: 'Campos obrigatórios',
        text2: 'Preencha todos os campos obrigatórios',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editedAddress) {
        await addressService.updateAddress(addressInfo);
        Toast.show({
          type: 'success',
          text1: 'Endereço atualizado com sucesso!',
        });
      } else {
        await addressService.createAddress(addressInfo);
        Toast.show({
          type: 'success',
          text1: 'Endereço cadastrado com sucesso!',
        });
      }
      setShowForm(false);
      setEditedAddress(null);
      setAddressInfo({
        CODPES: addressInfo.CODPES,
        CODEND: '',
        CEP: '',
        LOGRADOURO: '',
        BAIRRO: '',
        CIDADE: '',
        COMPLEMENTO: '',
        NUMERO: '',
        UF: '',
        DESCRICAO: '',
      });
      setCep('');
      fetchUserData();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar endereço',
        text2: 'Tente mais tarde',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (address) => {
    setEditedAddress(address);
    setAddressInfo({
      CODPES: address.CODPES,
      CODEND: address.CODEND,
      CEP: address.CEP,
      LOGRADOURO: address.LOGRADOURO,
      BAIRRO: address.BAIRRO,
      CIDADE: address.CIDADE,
      COMPLEMENTO: address.COMPLEMENTO || '',
      NUMERO: address.NUMERO,
      UF: address.UF,
      DESCRICAO: address.DESCRICAO || '',
    });
    setCep(address.CEP);
    setShowForm(true);
  };

  const handleDelete = (address) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este endereço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await addressService.deleteAddress(address.CODEND);
              Toast.show({
                type: 'success',
                text1: 'Endereço excluído com sucesso!',
              });
              fetchUserData();
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Erro ao excluir endereço',
              });
            }
          },
        },
      ]
    );
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
        {!showForm ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Meus Endereços</Text>
              <Button
                variant="primary"
                size="medium"
                onPress={() => {
                  setShowForm(true);
                  setEditedAddress(null);
                  setAddressInfo({
                    ...addressInfo,
                    CODEND: '',
                    CEP: '',
                    LOGRADOURO: '',
                    BAIRRO: '',
                    CIDADE: '',
                    COMPLEMENTO: '',
                    NUMERO: '',
                    UF: '',
                    DESCRICAO: '',
                  });
                  setCep('');
                }}
                style={styles.addButton}
              >
                Adicionar Endereço
              </Button>
            </View>

            {addresses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="location-outline" size={48} color={colors.gray400} />
                <Text style={styles.emptyText}>Nenhum endereço cadastrado</Text>
                <Text style={styles.emptySubtext}>
                  Adicione um endereço para facilitar suas compras
                </Text>
              </View>
            ) : (
              <View style={styles.addressesContainer}>
                {addresses.map((address) => (
                  <View key={address.CODEND} style={styles.addressCard}>
                    <View style={styles.addressInfo}>
                      <Text style={styles.addressTitle}>
                        {address.DESCRICAO || 'Endereço'}
                      </Text>
                      <Text style={styles.addressText}>
                        {address.LOGRADOURO}, {address.NUMERO}
                      </Text>
                      {address.COMPLEMENTO && (
                        <Text style={styles.addressText}>{address.COMPLEMENTO}</Text>
                      )}
                      <Text style={styles.addressText}>
                        {address.BAIRRO}, {address.CIDADE} - {address.UF}
                      </Text>
                      <Text style={styles.addressText}>CEP: {address.CEP}</Text>
                    </View>
                    <View style={styles.addressActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEdit(address)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="pencil-outline" size={20} color={colors.black} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDelete(address)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash-outline" size={20} color={colors.red600} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editedAddress ? 'Editar Endereço' : 'Novo Endereço'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowForm(false);
                  setEditedAddress(null);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={colors.gray600} />
              </TouchableOpacity>
            </View>

            <Input
              label="CEP"
              placeholder="00000-000"
              value={cep}
              onChangeText={(value) => handleChange('CEP', value)}
              required
            />

            <Input
              label="Logradouro"
              placeholder="Rua, Avenida, etc."
              value={addressInfo.LOGRADOURO}
              onChangeText={(value) => handleChange('LOGRADOURO', value)}
              required
            />

            <Input
              label="Número"
              placeholder="123"
              value={addressInfo.NUMERO}
              onChangeText={(value) => handleChange('NUMERO', value)}
              required
            />

            <Input
              label="Complemento"
              placeholder="Apto, Bloco, etc."
              value={addressInfo.COMPLEMENTO}
              onChangeText={(value) => handleChange('COMPLEMENTO', value)}
            />

            <Input
              label="Bairro"
              placeholder="Nome do bairro"
              value={addressInfo.BAIRRO}
              onChangeText={(value) => handleChange('BAIRRO', value)}
              required
            />

            <Input
              label="Cidade"
              placeholder="Nome da cidade"
              value={addressInfo.CIDADE}
              onChangeText={(value) => handleChange('CIDADE', value)}
              required
            />

            <Input
              label="UF"
              placeholder="SP"
              value={addressInfo.UF}
              onChangeText={(value) => handleChange('UF', value.toUpperCase())}
              maxLength={2}
              required
            />

            <Input
              label="Descrição (opcional)"
              placeholder="Casa, Trabalho, etc."
              value={addressInfo.DESCRICAO}
              onChangeText={(value) => handleChange('DESCRICAO', value)}
            />

            <Button
              variant="primary"
              size="large"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitButton}
            >
              {editedAddress ? 'Atualizar' : 'Salvar'}
            </Button>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray900,
  },
  addButton: {
    alignSelf: 'flex-end',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.gray900,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
  },
  addressesContainer: {
    gap: spacing.md,
  },
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  addressText: {
    fontSize: 14,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  addressActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  actionButton: {
    padding: spacing.sm,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.gray900,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});

export default AddressScreen;

