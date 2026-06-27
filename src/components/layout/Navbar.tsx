import { Icon } from "@iconify/react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import TransactionFormModal from "../modals/TransactionFormModal";


const Navbar = () => {
    const [isOpen, setIsOpen] = useState<Boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    return(
        <nav className="p-4 bg-gray-800 text-white">
            {/* Desktop view */}
            <div className="flex gap-5  items-center">
                <div className="flex gap-1 md:gap-0 md:flex-col items-center">
                    <Icon icon={"streamline-ultimate-color:coin-purse-1"} width={48} height={48}/>
                    <p className="font-bold text-3xl md:text-lg leading-0">PennyDay</p>
                </div>
                

                <ul className="hidden md:flex gap-3 w-full items-center">
                    <li>
                        <NavLink to={"/"} end className={({isActive}) => `px-3 py-2 rounded-md transition-colors duration-300 ${isActive ? `bg-gray-900 ` : `hover:bg-white/5`}`}>Calendar</NavLink>
                    </li>

                    <li>
                        <NavLink to={"/budget-overview"} className={({isActive}) => `px-3 py-2 rounded-md transition-colors duration-300 ${isActive ? `bg-gray-900 ` : `hover:bg-white/5`}`}>Budget Overview</NavLink>
                    </li>

                    <li className="ml-auto">
                        <button type="button" className="flex justify-center items-center gap-2 transition-colors duration-300 bg-[#615fff] hover:bg-[#7c86ff] rounded px-2 py-1 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                            <Icon icon="mdi:add" height="20" width="20"/>
                            <p className="">Add Transation </p>
                        </button>

                        <TransactionFormModal isOpen={isModalOpen} setIsOpen={setIsModalOpen}></TransactionFormModal>
                    </li>
                </ul>

                

                <button type="button" className="md:hidden ml-auto relative w-10 h-10" onClick={() => setIsOpen(prev => !prev)}>
                    <Icon icon="quill:hamburger" width="40" height="40" className={`absolute inset-0 transition duration-600 ease-in-out ${isOpen ? "opacity-0" : "opacity-100"}`}/>
                    <Icon icon="material-symbols:close-rounded" width="40" height="40" className={`absolute inset-0 transition duration-600 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"}`}/>
                </button>
            </div>

            {/* Mobile View */}
            <div  className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
                <ul className="flex flex-col gap-5 pt-5 items-end">
                    <li className="text-lg">
                        <NavLink to={"/"} end className={({isActive}) => isActive ? `bg-gray-900 px-3 py-2 rounded-md` : `` }>Calendar</NavLink>
                    </li>

                    <li>
                        <NavLink to={"/budget-overview"} className={({isActive}) => isActive ? `bg-gray-900 px-3 py-2 rounded-md` : ``}>Budget Overview</NavLink>
                    </li>

                    <li>
                        <button type="button" className="flex justify-center items-center gap-2 bg-[#615fff] rounded px-2 py-1" onClick={() => setIsModalOpen(true)}>
                            <Icon icon="mdi:add" height="20" width="20"/>
                            <span>Add Transation </span>
                        </button>

                        <TransactionFormModal isOpen={isModalOpen} setIsOpen={setIsModalOpen}></TransactionFormModal>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;