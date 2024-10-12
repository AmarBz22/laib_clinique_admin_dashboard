import { useSidebar } from './SidebarContext'; // Adjust the import path accordingly
import SideBar from "./components/SideBar";
import Header from "./components/Header";

const Layout = ({ children }) => {
    const { isSidebarOpen, toggleSidebar } = useSidebar();

    return ( 
        <div className="w-full flex justify-start items-start ">
            <div>
                {isSidebarOpen && <SideBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />}
            </div>
            <div className="w-full">
                <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                {children}
            </div>  
        </div>
    );
}
 
export default Layout;
