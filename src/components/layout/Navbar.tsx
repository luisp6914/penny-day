import { Icon } from "@iconify/react";
import { useState } from "react";


const Navbar = () => {
    const [isOpen, setIsOpen] = useState<Boolean>(false);

    return(
        <nav className="p-4 bg-gray-800 text-white">
            {/* Desktop view */}
            <div className="flex gap-5 justify-center items-center">
                <Icon icon={"streamline-ultimate-color:coin-purse-1"} width={48} height={48}></Icon>

                <ul className="hidden md:flex">
                    <li>
                        <button type="button" className="flex justify-center items-center gap-2 bg-[#615fff] rounded px-3 py-1.5 cursor-pointer">
                            <Icon icon="mdi:add" height="20" width="20"/>
                            <span>Add Transation </span>
                        </button>
                    </li>
                </ul>

                <p className="md:ml-auto font-bold text-xl">PennyDay</p>

                <button type="button" className="md:hidden ml-auto relative w-10 h-10" onClick={() => setIsOpen(prev => !prev)}>
                    <Icon icon="quill:hamburger" width="40" height="40" className={`absolute inset-0 transition duration-600 ease-in-out ${isOpen ? "opacity-0" : "opacity-100"}`}/>
                    <Icon icon="material-symbols:close-rounded" width="40" height="40" className={`absolute inset-0 transition duration-600 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"}`}/>
                </button>
            </div>

            {/* Mobile View */}
            <div  className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
                <ul className="flex flex-col gap-5 pt-5 items-end">
                    <li>
                        <button type="button" className="flex justify-center items-center gap-2 bg-[#615fff] rounded px-3 py-1.5 cursor-pointer">
                            <Icon icon="mdi:add" height="20" width="20"/>
                            <span>Add Transation </span>
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;