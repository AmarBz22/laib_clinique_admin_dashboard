import { useState } from "react";
import SideBar from "./components/SideBar";
import Header from "./components/Header";

const Layout = ({children}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [isAnimating, setIsAnimating] = useState(false);


const toggleSidebar = () => {
if (isSidebarOpen) {
    setIsAnimating(true);
    setTimeout(() => {
    setIsSidebarOpen(false);
    setIsAnimating(false);
    }, 300);
} else {
    setIsSidebarOpen(true);
}
};


return ( 
    <div className="w-full flex justify-start items-start ">
        <div >
        {isSidebarOpen && <SideBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>}
        </div>
        <div className="w-full">
            <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            {children}
        </div>  
    </div>
 );
}
 
export default Layout;