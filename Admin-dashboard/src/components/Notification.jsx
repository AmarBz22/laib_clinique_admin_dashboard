import axios from "axios";
import { BiBook, BiCalendar, BiShoppingBag } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../constants";
import { toast } from "react-toastify";

const Notification = ({type, client, id, openNotification, noty_id, setNotifications, timestamp}) => {
    const navigate = useNavigate(); 
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp); // Crée un objet Date à partir du timestamp
    
        // Récupère les composants de la date
        const day = String(date.getDate()).padStart(2, '0'); // Récupère le jour et ajoute un zéro de tête si nécessaire
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Récupère le mois et ajoute un zéro de tête si nécessaire
        const year = date.getFullYear(); // Récupère l'année complète
        const hours = String(date.getHours()).padStart(2, '0'); // Récupère les heures et ajoute un zéro de tête si nécessaire
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Récupère les minutes et ajoute un zéro de tête si nécessaire
    
        // Retourne la chaîne de date formatée
        return `${day}/${month}/${year} à ${hours}:${minutes}`;
    };
    console.log(timestamp);
    
    const handleClick = async () => {
        let link;
        openNotification(false);

        if (type === "Order") link = `/orders/${id}`;
        else if (type === "Appointment") link = `/appointments/${id}`;
        else if (type === "Training Request") link = `/courses/${id}`;
        
        try {
            const response = await axios.post(`${BACKEND_URL}/api/notification/seen/${noty_id}`); // Remplace par l'URL de ton API de notifications
            if(response.statusText === "OK") {
                setNotifications((prevNotifications) => 
                    prevNotifications.filter((notification) => notification._id !== noty_id)
                );
                if (link) {
                    navigate(link);
                }
            }
        } catch (error) {
          if(error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Échec de voir la notification");
            } 
        }
    };
    
    return ( 
        <div 
        className={`border-b-2 p-2 border-gray-600 flex justify-start flex-col items-start ${
          type ? "hover:opacity-70 hover:cursor-pointer" : ""
        }`}
        onClick={type ? handleClick : undefined}
      >
        {type ? (
          <>
            <div className="flex justify-start items-center font-bold">
                {type === "Order" && <BiShoppingBag className="font-bold" />}
                {type === "Appointment" && <BiCalendar className="font-bold" />}
                {type === "Training Request" && <BiBook className="font-bold" />}
                <h3 className="font-bold">
            {`${
                type === 'Appointment' ? 'Nouveau' : 'Nouvelle'
             } ${
                type === 'Order'
                ? 'Commande'
                : type === 'Appointment'
                ? 'Rendez-vous'
                : type === 'Training Request'
                ? 'Demande de Formation'
                : type
            }`}
                </h3>
            </div>
            
            <h3>
                {`Le client ${client} a soumis ${
                type === 'Appointment' ? 'un nouveau' : 'une nouvelle'
                 } ${
                type === 'Order'
                ? 'Commande'
                : type === 'Appointment'
                ? 'Rendez-vous'
                : type === 'Training Request'
                ? 'Demande de Formation'
                : type
                }.`}
            </h3>


          </>
        ) : (
          <h3 className="text-gray-600">Aucune nouvelle notification</h3>
        )}
      </div> 
    );
}
 
export default Notification;
