import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Importer Link de react-router-dom pour le routage
import axios from 'axios';
import { BACKEND_URL } from '../../constants/index'; // Ajustez le chemin d'importation si nécessaire
import { toast } from 'react-toastify';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]); // État pour stocker les commandes
  const [loading, setLoading] = useState(true); // État pour gérer le chargement

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/order/getAllorders`); // Récupérer les commandes depuis le backend
        setOrders(response.data); // Définir les commandes à partir de la réponse
      } catch (error) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      } finally {
        setLoading(false); // Définir le chargement à faux
      }
    };

    fetchOrders(); // Appeler la fonction de récupération
  }, []);

  if (loading) return <div>Chargement...</div>; // Afficher l'état de chargement

  return (
    <div className="w-full mt-5 border border-gray-200 rounded-lg shadow-md">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Commandes récentes</h2>
        
        <Link to="/orders" className="bg-primary-pink text-white px-4 py-2 rounded transition hover:bg-light-pink font-semibold">
          Voir tout
        </Link>
      
      </div>
      <div className="w-full bg-white rounded-lg shadow-md p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">Nom</th>
              <th className="border-b p-2 text-left">Localisation</th>
              <th className="border-b p-2 text-left">Téléphone</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 4).map((order, index) => ( // Afficher seulement les 4 premières commandes
              <tr key={order._id} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                <td className="p-2">{order.clientName}</td> {/* Nom du client */}
                <td className="p-2">{order.address}</td> {/* Adresse */}
                <td className="p-2">{order.phone}</td> {/* Numéro de téléphone */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
