import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/products/get');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='p-6 mt-20'>
      <h1 className="text-2xl font-semibold mb-8 text-center">Produits</h1>

      <div className="flex md:gap-0 gap-5 flex-col md:flex-row xl:items-center md:justify-between mb-8">
        <input
          type="text"
          placeholder="Rechercher par titre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border rounded"
        />
        <Link to="addProduct">
          <button className="bg-primary-pink text-white py-2 px-4 rounded  hover:bg-pink-700 transition">
            Ajouter un produit
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const photoUrl = product.photo.replace(/\\/g, '/');
            const shortDescription = product.description.length > 50 
              ? product.description.substring(0, 50) + '...' 
              : product.description;

            return (
              <div key={product._id} className="border rounded-lg shadow-lg p-4 bg-white hover:shadow-xl transition">
                <img src={`http://localhost:4000/${photoUrl}`} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                <p className="text-gray-600">{shortDescription}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold">{product.price} DZ</span>
                  <Link to={`/products/${product._id}`}>
                    <button className="bg-primary-pink text-white py-2 px-4 rounded hover:bg-pink-700 transition">
                      Voir plus
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
