import { BiBook, BiCalendar, BiShoppingBag } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Notification = ({type,client,id,openNotification}) => {
    const navigate = useNavigate(); 

    const handleClick = ()=>{
        let link 
        openNotification(false)

        if(type === "Order") link=`/orders/${id}` 
        else if(type === "Appointment")  link=`/appointments/${id}` 
        else if(type === "Training Request") link = `/courses/${id}`
        if (link) {
            navigate(link);
        }
    }
    return ( 
    <div className="border-b-2 p-2 border-gray-600 flex justify-start flex-col items-start hover:opacity-70 hover:cursor-pointer" onClick={handleClick}>
        <div className="flex justify-start items-center text-bold">
            {type === "Order" && <BiShoppingBag  className="font-bold" /> }
            {type === "Appointment" && <BiCalendar  className="font-bold" /> }
            {type === "Training Request" && <BiBook  className="font-bold" /> }
            <h3 className="font-bold">New {type}</h3>
        </div>
        <h3>
            {`The client ${client}  submitted a new ${type}.`}
        </h3>
  
    </div> );
}
 
export default Notification;