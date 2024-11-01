import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const ProductCard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/products/get');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='p-6 mt-20'>
     <h1 className="text-2xl font-semibold mb-8 text-center">Products</h1>

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-8">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border rounded"
        />
        <Link to ="addProduct" >
        <button className="bg-primary-pink text-white py-2 px-4 rounded ml-4 hover:bg-pink-700 transition">
          Add Product
        </button>
        </Link>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const photoUrl = product.photo.replace(/\\/g, '/'); // Replace backslashes with forward slashes

          return (
            <div key={product._id} className="border rounded-lg shadow-lg p-4 bg-white hover:shadow-xl transition">
              <img src={`http://localhost:4000/${photoUrl}`} alt={product.name} className="w-full h-40 object-cover rounded-md" />
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold">{product.price} DZ</span>
                <Link to={"/products/"+product._id}>
                <button className="bg-primary-pink text-white py-2 px-4 rounded hover:bg-pink-700 transition">
                  See More
                </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCard;
