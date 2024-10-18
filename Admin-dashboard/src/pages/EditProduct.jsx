import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../constants';

const EditProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        photo: null,
    });
    const { productId } = useParams(); 
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setError(null);
                const response = await axios.get(`${BACKEND_URL}/api/products/${productId}`);
                const updatedData = {
                    ...response.data,
                    photo: response.data.photo.replace(/\\/g, '/'), // Ensure correct path format
                };
                setProduct(updatedData); 
            } catch (error) {
                toast.error(error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            photo: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price.toString());
        formData.append('stockQuantity', product.stockQuantity.toString());
        if (product.photo) {
            formData.append('photo', product.photo);
        }

        try {
            const response = await axios.put(`${BACKEND_URL}/api/products/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.statusText === "OK") {
                toast.success('Product updated successfully!'); 
                navigate(`/products/${productId}`);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (isLoading) return <h3 className="flex justify-center items-center h-screen text-lg font-bold">Loading...</h3>;
    if (error) return <h3 className="flex justify-center items-center h-screen text-lg font-bold text-red-600">{error}</h3>;

    return (
        <div className="p-6 mt-20">
            <h1 className="text-2xl font-semibold mb-4 text-center">Edit Product</h1>
            <div className="border border-gray-300 shadow-lg p-4 rounded-lg mb-6 bg-white">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Product Name:</label>
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
                        <label className="block mb-2">Description:</label>
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
                        <label className="block mb-2">Price:</label>
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
                        <label className="block mb-2">Stock Quantity:</label>
                        <input
                            type="number"
                            name="stockQuantity"
                            value={product.stockQuantity}
                            onChange={handleChange}
                            required
                            className="p-2 border rounded w-full"
                            min="0"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Product Image: <span className='text-[12px] text-red-600 font-bold'>If you want to keep the previous image, don't upload a new one.</span></label>
                        <input
                            type="file"
                            name="photo"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="p-2 border rounded w-full"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="submit" className="bg-primary-pink text-white p-2 rounded">
                            Update Product
                        </button>
                        <button
                            type="button"
                            className="bg-gray-400 text-white p-2 rounded"
                            onClick={() => navigate(`/products/${productId}`)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
