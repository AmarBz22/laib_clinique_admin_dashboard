import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    photo: null,
  });
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('stockQuantity', product.stockQuantity);
    formData.append('photo', product.photo);

    try {
      const response = await axios.post('http://localhost:4000/api/products/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Produit ajouté avec succès !');
      navigate('/products');
      console.log(response.data);
    } catch (error) {
      toast.error("Erreur lors de l'ajout du produit");
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false when request completes
    }
  };

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-4 text-center">Ajouter un Produit</h1>
      <div className="border border-gray-300 shadow-lg p-4 rounded-lg mb-6 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Nom du Produit :</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description :</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Prix :</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Quantité en Stock :</label>
            <input
              type="number"
              name="stockQuantity"
              value={product.stockQuantity}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full"
              min="1"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Image du Produit :</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-primary-pink text-white p-2 rounded flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin mr-2" /> : "Ajouter le Produit"}
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white p-2 rounded"
              onClick={() => navigate('/products')}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
