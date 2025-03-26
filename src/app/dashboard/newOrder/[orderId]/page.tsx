"use client"
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { api } from '@/services/api'; // Presumindo que você tenha um arquivo api.ts para centralizar a configuração do axios
import { getCookieClient } from '@/lib/cookieClient'
import { toast } from 'sonner';

// Tipos para as categorias e produtos
interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  category_id: string;
  price: string;
  description: string;
  banner: string;
}

export default function OrderDetails() {
  const { orderId } = useParams(); // Pegando o parâmetro da URL diretamente
  const router = useRouter(); // Usando o useRouter para navegação
  const [categories, setCategories] = useState<Category[]>([]); // Para armazenar as categorias
  const [products, setProducts] = useState<Product[]>([]); // Para armazenar os produtos filtrados
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Para armazenar todos os produtos
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Categoria selecionada
  const [selectedProduct, setSelectedProduct] = useState<string>(''); // Produto selecionado
  const [amount, setAmount] = useState<number>(1); // Para armazenar a quantidade do produto

  // Carregar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await getCookieClient()
        const response = await api.get<Category[]>('/category', {
          headers: {
            Authorization: token
          }
        }); // Tipando a resposta como um array de Category
        setCategories(response.data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };
    fetchCategories();
  }, []);

  // Carregar todos os produtos
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const token = await getCookieClient()
        const response = await api.get<Product[]>('/category/product', {
          headers: {
            Authorization: token
          }
        }); // Tipando a resposta como um array de Product
        setAllProducts(response.data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    };
    fetchAllProducts();
  }, []); // A dependência aqui pode ser apenas um array vazio

  // Filtrar produtos com base na categoria selecionada
  useEffect(() => {
    if (selectedCategory) {
      const filteredProducts = allProducts.filter(
        (product) => product.category_id === selectedCategory
      );
      setProducts(filteredProducts);
    }
  }, [selectedCategory, allProducts]); // Atualiza quando mudar o selectedCategory ou allProducts

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
    setSelectedProduct(''); // Resetar o produto ao mudar a categoria
  };

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(event.target.value);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o envio do formulário
    if (!selectedProduct || !orderId || amount <= 0) {
      toast.warning("Por favor, selecione um produto, uma categoria e uma quantidade válida!")
      return;
    }

    try {
      const token = await getCookieClient()
      const data = {
        amount: amount,
        order_id: orderId,
        product_id: selectedProduct
      }

      const response = await api.post("/order/add", data, {
        headers: {
          Authorization: token
        }
      })
      toast.success("Produto adicionado com sucesso")
    } catch(error) {
      toast.error("Erro ao adicionar")
      return
    }
  }

  const handleSendProduct = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o envio do formulário

    try{
      const token = await getCookieClient()
      await api.put("/order/send", {
        order_id: orderId
      }, {
        headers: {
          Authorization: token
        }
      })
      toast.success("Produto enviado com sucesso")

      // Agora, redireciona para a página "/dashboard" corretamente, sem manter parâmetros
      router.push("/dashboard"); // Redirecionamento direto para o dashboard sem os parâmetros da URL anterior

    }catch(error) {
      toast.error("Erro ao enviar")
      return
    }
  }
  
  if (!orderId) {
    return <div>Carregando...</div>;
  }

  return (
    <main className={styles.container}>
      <h1>Registrar Pedido</h1>
      
      <form action="" className={styles.form}>
        <input
          className={styles.input}
          type="number"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Digite a quantidade"
          required
        />

        <select
          className={styles.input}
          name="category"
          value={selectedCategory}
          onChange={handleCategoryChange}

        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          className={styles.input}
          name="product"
          value={selectedProduct}
          onChange={handleProductChange}

        >
          <option value="" disabled>
            Selecione um produto
          </option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        <button className={styles.addButton} onClick={handleAddProduct}>Acrescentar Produto</button>
        <button className={styles.sendButton} onClick={handleSendProduct}>Enviar Pedido</button>
      </form>
    </main>
  );
}
