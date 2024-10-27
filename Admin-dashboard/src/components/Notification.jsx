import axios from "axios";
import { BiBook, BiCalendar, BiShoppingBag } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../constants";
import { toast } from "react-toastify";

const Notification = ({type,client,id,openNotification,noty_id,setNotifications,timestamp}) => {
    const navigate = useNavigate(); 
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp); // Create a Date object from the timestamp
    
        // Get date components
        const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad with leading zero
        const year = date.getFullYear(); // Get full year
        const hours = String(date.getHours()).padStart(2, '0'); // Get hours and pad with leading zero
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero
    
        // Return formatted date string
        return `${day}/${month}/${year} at ${hours}:${minutes}`;
    };
    console.log(timestamp);
    
    const handleClick =async ()=>{
        let link 
        openNotification(false)

        if(type === "Order") link=`/orders/${id}` 
        else if(type === "Appointment")  link=`/appointments/${id}` 
        else if(type === "Training Request") link = `/courses/${id}`
        try {
            const response = await axios.post(`${BACKEND_URL}/api/notification/seen/${noty_id}`); // Replace with your notifications API endpoint
            if(response.statusText==="OK")
            {
                setNotifications((prevNotifications) => 
                    prevNotifications.filter((notification) => notification._id !== noty_id)
                );
                if (link) {
                    navigate(link);
                }
            }
        } catch (error) {
          if(error.response?.data?.message)
            {
                toast.error(error.response.data.message)
            }
            else{
                toast.error("Faild to see notification")
            } 
        }
        
    }
    return ( 
    <div className="border-b-2 p-2 border-gray-600 flex justify-start flex-col items-start hover:opacity-70 hover:cursor-pointer" onClick={handleClick}>
        <div className="flex justify-between w-full">
            <div className="flex justify-start items-center text-bold">
                {type === "Order" && <BiShoppingBag  className="font-bold" /> }
                {type === "Appointment" && <BiCalendar  className="font-bold" /> }
                {type === "Training Request" && <BiBook  className="font-bold" /> }
                <h3 className="font-bold">New {type}</h3>
            </div>
            <h3 className="text-sm text-gray-600">{formatTimestamp(timestamp)}</h3>
        </div>
        
        <h3>
            {`The client ${client}  submitted a new ${type}.`}
        </h3>
  
    </div> );
}
 
export default Notification;