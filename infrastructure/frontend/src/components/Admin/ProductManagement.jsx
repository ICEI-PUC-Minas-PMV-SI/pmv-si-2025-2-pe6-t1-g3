import React, { useState, useEffect, useMemo } from 'react';
import { productService } from '../../services/api';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import LoadingSpinner from '../UI/LoadingSpinner';
import { FiPlus, FiEdit, FiTrash2, FiPackage, FiSearch, FiFilter, FiX, FiImage, FiAlertCircle } from 'react-icons/fi';

const ProductManagement = ({ onProductChange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const [formData, setFormData] = useState({
    PRODUTO: '',
    DESCRICAO: '',
    IMAGEM: '',
    VALOR: '',
    ESTOQUE: '',
    DESCONTO: '',
    CODCAT: '2',
    TAMANHOS: []
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    stockStatus: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const categories = [
    { id: '1', name: 'ELETRÔNICOS', label: 'Eletrônicos' },
    { id: '2', name: 'FASHION', label: 'Fashion' },
    { id: '3', name: 'CASA', label: 'Casa' },
    { id: '4', name: 'ESPORTES', label: 'Esportes' }
  ];

  const clothingSizes = ['P', 'M', 'G', 'GG'];
  const shoeSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (formData.IMAGEM) {
      setImagePreview(formData.IMAGEM);
    } else {
      setImagePreview('');
    }
  }, [formData.IMAGEM]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts();
      setProducts(response.data);
      setImageErrors({});
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      if (imageErrors[product.CODPROD]) {
        return false;
      }

      const matchesSearch = searchTerm === '' ||
        product.PRODUTO.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.DESCRICAO.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filters.category === '' ||
        product.CODCAT?.toString() === filters.category;

      const matchesStock = filters.stockStatus === '' ||
        (filters.stockStatus === 'in_stock' && product.ESTOQUE > 10) ||
        (filters.stockStatus === 'low_stock' && product.ESTOQUE > 0 && product.ESTOQUE <= 10) ||
        (filters.stockStatus === 'out_of_stock' && product.ESTOQUE === 0);

      const matchesMinPrice = filters.minPrice === '' ||
        product.VALOR >= parseFloat(filters.minPrice);

      const matchesMaxPrice = filters.maxPrice === '' ||
        product.VALOR <= parseFloat(filters.maxPrice);

      return matchesSearch && matchesCategory && matchesStock && matchesMinPrice && matchesMaxPrice;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'name':
          aVal = a.PRODUTO.toLowerCase();
          bVal = b.PRODUTO.toLowerCase();
          break;
        case 'price':
          aVal = a.VALOR;
          bVal = b.VALOR;
          break;
        case 'stock':
          aVal = a.ESTOQUE;
          bVal = b.ESTOQUE;
          break;
        case 'category':
          aVal = a.CATEGORIAS?.CATEGORIA || '';
          bVal = b.CATEGORIAS?.CATEGORIA || '';
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchTerm, filters, sortBy, sortOrder, imageErrors]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  const productStats = useMemo(() => {
    return {
      total: products.length,
      inStock: products.filter(p => p.ESTOQUE > 10).length,
      lowStock: products.filter(p => p.ESTOQUE > 0 && p.ESTOQUE <= 10).length,
      outOfStock: products.filter(p => p.ESTOQUE === 0).length,
      totalValue: products.reduce((sum, p) => sum + (p.VALOR * p.ESTOQUE), 0)
    };
  }, [products]);

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

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      TAMANHOS: prev.TAMANHOS.includes(size)
        ? prev.TAMANHOS.filter(s => s !== size)
        : [...prev.TAMANHOS, size]
    }));
  };

  const getAvailableSizes = () => {
    const productName = formData.PRODUTO.toLowerCase();
    if (productName.includes('tênis') || productName.includes('tenis') ||
        productName.includes('sapato') || productName.includes('sandália')) {
      return shoeSizes;
    }
    if (formData.CODCAT === '2') {
      return clothingSizes;
    }
    return [];
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

    if (formData.DESCONTO && (isNaN(formData.DESCONTO) || parseFloat(formData.DESCONTO) < 0 || parseFloat(formData.DESCONTO) > 100)) {
      newErrors.DESCONTO = 'Desconto deve estar entre 0 e 100';
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
        ESTOQUE: parseInt(formData.ESTOQUE),
        DESCONTO: formData.DESCONTO ? parseFloat(formData.DESCONTO) : 0,
        CODCAT: parseInt(formData.CODCAT),
        TAMANHOS: formData.TAMANHOS.length > 0 ? JSON.stringify(formData.TAMANHOS) : null
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
    let sizes = [];
    if (product.TAMANHOS) {
      try {
        sizes = JSON.parse(product.TAMANHOS);
      } catch (e) {
        sizes = [];
      }
    }

    setEditingProduct(product);
    setFormData({
      PRODUTO: product.PRODUTO,
      DESCRICAO: product.DESCRICAO,
      IMAGEM: product.IMAGEM || '',
      VALOR: product.VALOR.toString(),
      ESTOQUE: product.ESTOQUE.toString(),
      DESCONTO: product.DESCONTO?.toString() || '',
      CODCAT: product.CODCAT?.toString() || '2',
      TAMANHOS: sizes
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${product.PRODUTO}"?`)) {
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
      DESCONTO: '',
      CODCAT: '2',
      TAMANHOS: []
    });
    setEditingProduct(null);
    setShowForm(false);
    setErrors({});
    setImagePreview('');
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      stockStatus: '',
      minPrice: '',
      maxPrice: ''
    });
    setSearchTerm('');
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Esgotado</span>;
    } else if (stock <= 10) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Estoque Baixo</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Disponível</span>;
  };

  const availableSizes = getAvailableSizes();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-900">{productStats.total}</p>
            </div>
            <FiPackage className="text-blue-600" size={24} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Estoque</p>
              <p className="text-2xl font-bold text-green-600">{productStats.inStock}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estoque Baixo</p>
              <p className="text-2xl font-bold text-yellow-600">{productStats.lowStock}</p>
            </div>
            <FiAlertCircle className="text-yellow-600" size={24} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor em Estoque</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(productStats.totalValue)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <FiPlus className="mr-2" size={16} />
          Adicionar Produto
        </Button>
      </div>

      {showForm && (
        <Card>
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
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
                      name="CODCAT"
                      value={formData.CODCAT}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="DESCRICAO"
                    value={formData.DESCRICAO}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                  {errors.DESCRICAO && (
                    <p className="mt-1 text-sm text-red-600">{errors.DESCRICAO}</p>
                  )}
                </div>

                <Input
                  label="URL da Imagem"
                  name="IMAGEM"
                  value={formData.IMAGEM}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <Input
                    label="Desconto (%)"
                    name="DESCONTO"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.DESCONTO}
                    onChange={handleInputChange}
                    error={errors.DESCONTO}
                    placeholder="0"
                  />
                </div>

                {availableSizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamanhos Disponíveis
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                            formData.TAMANHOS.includes(size)
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {formData.TAMANHOS.length > 0 && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selecionados: {formData.TAMANHOS.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview da Imagem
                </label>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="text-gray-400"><svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p class="mt-2 text-sm">Erro ao carregar imagem</p></div>';
                      }}
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FiImage size={48} className="mx-auto mb-2" />
                      <p className="text-sm">Sem imagem</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4 border-t">
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

      <Card>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Todas Categorias</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
              <select
                value={filters.stockStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, stockStatus: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Todos Estoques</option>
                <option value="in_stock">Disponível</option>
                <option value="low_stock">Estoque Baixo</option>
                <option value="out_of_stock">Esgotado</option>
              </select>
              {(searchTerm || filters.category || filters.stockStatus) && (
                <Button variant="outline" onClick={resetFilters}>
                  <FiX className="mr-2" size={14} />
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        {loading ? (
          <LoadingSpinner className="py-8" />
        ) : paginatedProducts.length > 0 ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      onClick={() => handleSort('name')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    >
                      Produto {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      onClick={() => handleSort('category')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    >
                      Categoria {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      onClick={() => handleSort('price')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    >
                      Preço {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      onClick={() => handleSort('stock')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    >
                      Estoque {sortBy === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tamanhos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProducts.map((product) => {
                    let sizes = [];
                    if (product.TAMANHOS) {
                      try {
                        sizes = JSON.parse(product.TAMANHOS);
                      } catch (e) {
                        sizes = [];
                      }
                    }

                    return (
                      <tr key={product.CODPROD} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded object-cover flex-shrink-0"
                              src={product.IMAGEM}
                              alt={product.PRODUTO}
                              onError={() => handleImageError(product.CODPROD)}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.PRODUTO}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.DESCRICAO?.substring(0, 40)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.CATEGORIAS?.CATEGORIA || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(product.VALOR)}
                          </div>
                          {product.DESCONTO > 0 && (
                            <div className="text-xs text-green-600">
                              {product.DESCONTO}% OFF
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.ESTOQUE}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStockBadge(product.ESTOQUE)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sizes.length > 0 ? sizes.join(', ') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleEdit(product)}
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-sm text-gray-600">
                Exibindo {paginatedProducts.length} de {filteredAndSortedProducts.length} produtos
              </p>

              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === page
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || filters.category || filters.stockStatus
                ? 'Tente ajustar os filtros de busca'
                : 'Comece adicionando seu primeiro produto'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductManagement;
