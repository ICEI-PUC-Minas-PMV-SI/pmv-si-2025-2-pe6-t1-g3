import React, { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import LoadingSpinner from '../UI/LoadingSpinner';
import { FiPlus, FiEdit, FiTrash2, FiPackage } from 'react-icons/fi';

const ProductManagement = ({ onProductChange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    PRODUTO: '',
    DESCRICAO: '',
    IMAGEM: '',
    VALOR: '',
    ESTOQUE: '',
    CATEGORIA: 'MASCULINO'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.PRODUTO) newErrors.PRODUTO = 'Nome do produto é obrigatório';
    if (!formData.DESCRICAO) newErrors.DESCRICAO = 'Descrição é obrigatória';
    if (!formData.VALOR) newErrors.VALOR = 'Preço é obrigatório';
    if (!formData.ESTOQUE) newErrors.ESTOQUE = 'Estoque é obrigatório';
    
    if (formData.VALOR && (isNaN(formData.VALOR) || parseFloat(formData.VALOR) <= 0)) {
      newErrors.VALOR = 'Preço deve ser um número positivo';
    }
    
    if (formData.ESTOQUE && (isNaN(formData.ESTOQUE) || parseInt(formData.ESTOQUE) < 0)) {
      newErrors.ESTOQUE = 'Estoque deve ser um número não negativo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const productData = {
        ...formData,
        VALOR: parseFloat(formData.VALOR),
        ESTOQUE: parseInt(formData.ESTOQUE)
      };

      if (editingProduct) {
        await productService.updateProduct({
          ...productData,
          CODPROD: editingProduct.CODPROD
        });
      } else {
        await productService.createProduct(productData);
      }

      resetForm();
      loadProducts();
      onProductChange?.();
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Erro ao salvar produto'
      });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      PRODUTO: product.PRODUTO,
      DESCRICAO: product.DESCRICAO,
      IMAGEM: product.IMAGEM || '',
      VALOR: product.VALOR.toString(),
      ESTOQUE: product.ESTOQUE.toString(),
      CATEGORIA: product.CATEGORIAS?.CATEGORIA || 'MASCULINO'
    });
    setShowForm(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Tem certeza que deseja excluir o produto "${product.PRODUTO}"?`)) {
      return;
    }

    try {
      await productService.deleteProduct(product.CODPROD);
      loadProducts();
      onProductChange?.();
    } catch (error) {
      alert('Erro ao excluir produto');
    }
  };

  const resetForm = () => {
    setFormData({
      PRODUTO: '',
      DESCRICAO: '',
      IMAGEM: '',
      VALOR: '',
      ESTOQUE: '',
      CATEGORIA: 'MASCULINO'
    });
    setEditingProduct(null);
    setShowForm(false);
    setErrors({});
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center"
        >
          <FiPlus className="mr-2" size={16} />
          Adicionar Produto
        </Button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome do Produto"
                name="PRODUTO"
                value={formData.PRODUTO}
                onChange={handleInputChange}
                error={errors.PRODUTO}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria <span className="text-red-500">*</span>
                </label>
                <select
                  name="CATEGORIA"
                  value={formData.CATEGORIA}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                >
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                </select>
              </div>
            </div>

            <Input
              label="Descrição"
              name="DESCRICAO"
              value={formData.DESCRICAO}
              onChange={handleInputChange}
              error={errors.DESCRICAO}
              required
            />

            <Input
              label="URL da Imagem"
              name="IMAGEM"
              value={formData.IMAGEM}
              onChange={handleInputChange}
              placeholder="https://exemplo.com/imagem.jpg"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Preço"
                name="VALOR"
                type="number"
                step="0.01"
                min="0"
                value={formData.VALOR}
                onChange={handleInputChange}
                error={errors.VALOR}
                required
              />

              <Input
                label="Estoque"
                name="ESTOQUE"
                type="number"
                min="0"
                value={formData.ESTOQUE}
                onChange={handleInputChange}
                error={errors.ESTOQUE}
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit">
                {editingProduct ? 'Atualizar' : 'Criar'} Produto
              </Button>
              <Button variant="outline" type="button" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Products List */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Lista de Produtos
          </h3>
        </div>

        {loading ? (
          <LoadingSpinner className="py-8" />
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.CODPROD} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={product.IMAGEM || '/api/placeholder/40/40'}
                            alt={product.PRODUTO}
                            onError={(e) => {
                              e.target.src = '/api/placeholder/40/40';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.PRODUTO}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.DESCRICAO?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.CATEGORIAS?.CATEGORIA || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.VALOR)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.ESTOQUE}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => handleEdit(product)}
                        className="mr-2"
                      >
                        <FiEdit size={14} />
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDelete(product)}
                      >
                        <FiTrash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhum produto encontrado</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductManagement;