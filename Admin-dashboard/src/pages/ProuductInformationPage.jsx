import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../constants";

const ProductInformationPage = () => {
    const [product, setProduct] = useState();
    const { productId } = useParams(); 
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setError(null);
                const response = await axios.get(`${BACKEND_URL}/api/products/${productId}`);
                const updatedData = {
                    ...response.data,
                    photo: response.data.photo.replace(/\\/g, '/')
                };
                setProduct(updatedData);
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message;
                toast.error(errorMessage);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleConfirm = async () => {
        try {
            const response = await axios.delete(`${BACKEND_URL}/api/products/${productId}`);
            if (response.statusText === "OK") {
                toast.success("Product deleted successfully");
                navigate("/products");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
        }
    };

    if (isLoading) return <h3 className="flex justify-center items-center h-screen text-lg font-bold">Loading...</h3>;
    if (error) return <h3 className="flex justify-center items-center h-screen text-lg font-bold text-red-600">{error}</h3>;

    return (
        <>
            {product && (
                <div className="px-6 pb-6">
                    <div className="p-4 mt-28 rounded-lg shadow-lg pb-8">
                        <div className="flex md:flex-row flex-col justify-between items-center">
                            <div className="flex items-center justify-start gap-2 w-full">
                                <h3 className="text-start font-bold text-xl break-all">
                                    {product.name}
                                </h3>
                            </div>
                            <div className="flex justify-end gap-2 items-center">
                                <Link to={`/products/edit/${product._id}`} className="bg-blue-600 px-4 py-1 rounded-sm text-white">Edit</Link>
                                <button onClick={() => setModalOpen(true)} className="bg-red-600 px-4 py-1 rounded-sm text-white">Delete</button>
                            </div>
                        </div>

                        <div className="mt-6 flex md:flex-row flex-col justify-start gap-4">
    <img src={`http://localhost:4000/${product.photo}`} alt={product.name} className="md:w-1/2 w-full object-cover rounded-sm" />
    <div className="w-full">
        <h2 className="text-lg font-bold mb-2">{product.name}</h2>
        <hr className="border-b-2 border-gray-400 mb-4" />
        <div className="mt-4">
            <p className="text-md font-semibold">Price: <span className="font-normal">{product.price},00 DZD</span></p>
            <p className="text-md font-semibold">Stock: <span className="font-normal">{product.stockQuantity}</span></p>
            <p className="text-md mt-2">{product.description || "No description available."}</p>
        </div>
    </div>
</div>


                    </div>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-6 w-94">
                                <h3 className="text-lg font-semibold mb-4">Delete Product</h3>
                                <p className="mb-4">Are you sure you want to delete this product?</p>
                                <div className="flex justify-end">
                                    <button className="bg-gray-300 text-black px-4 py-2 rounded ml-2" onClick={() => setModalOpen(false)}>No</button>
                                    <button className="px-4 py-2 rounded bg-red-500 text-white" onClick={handleConfirm}>Yes</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default ProductInformationPage;
