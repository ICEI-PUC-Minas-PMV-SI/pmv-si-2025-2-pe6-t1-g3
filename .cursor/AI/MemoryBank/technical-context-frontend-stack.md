# Technical Context - Frontend Stack

## Tecnologia
- **Nome**: React + Vite
- **Versão**: React ^18.2.0, Vite ^5.1.0
- **Propósito**: Interface web responsiva e moderna para a plataforma de e-commerce

## Configuração
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.2",
    "axios": "^1.6.8",
    "react-toastify": "^10.0.5",
    "@headlessui/react": "^1.7.18",
    "@heroicons/react": "^2.1.1",
    "@material-tailwind/react": "^2.1.9",
    "react-spinners": "^0.13.8",
    "jwt-decode": "^4.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38"
  }
}
```

## Padrões de Uso
- Componentes funcionais com hooks
- Roteamento com React Router
- Gerenciamento de estado com Context API
- Estilização com Tailwind CSS
- Requisições HTTP com Axios
- Notificações com React Toastify

## Dependências
- Node.js 18+
- Vite (build tool)
- Tailwind CSS (framework CSS)
- React Router (navegação)
- Axios (cliente HTTP)

## Exemplos de Implementação
```jsx
// Componente com hooks e contexto
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function ProductCard({ product }) {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img src={product.imagem} alt={product.produto} className="w-full h-48 object-cover" />
      <h3 className="text-lg font-semibold mt-2">{product.produto}</h3>
      <p className="text-gray-600">{product.descricao}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xl font-bold">R$ {product.valor}</span>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}

// Hook customizado para produtos
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/produtos');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, refetch: fetchProducts };
}
```

## Melhores Práticas
- Usar componentes funcionais e hooks
- Implementar lazy loading para otimização
- Separar lógica de negócio em hooks customizados
- Utilizar Context API para estado global
- Implementar tratamento de erros
- Seguir padrões de acessibilidade
- Otimizar performance com React.memo e useMemo

## Data de Criação
27/01/2025

## Última Atualização
27/01/2025
