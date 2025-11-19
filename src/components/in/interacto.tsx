import { Link } from "@tanstack/react-router";
import Buttino from "./customs/buttino";
import { IoDocumentLockSharp } from "react-icons/io5";
import { FaTrainTram } from "react-icons/fa6";

const Interacto = () => {
  const Todos = [
    // { name: "Track Sales" },
    { name: "Manage Records", path: '/in/Dashboard', icon: <IoDocumentLockSharp size={20} />},
    { name: "Chat With AI Farm Advisor", path: '/in/farm-advisor', icon: <FaTrainTram size={20}/>  },
    // { name: "Yield Predictor", path: '/in/Dashboard' },

  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-lg font-semibold">What do you want to do today!</p>
      <div className="md:flex gap-2 hidden ">
      {Todos.map((todo, index) => (
       <Link to={todo.path} key={index}><Buttino>{todo.name}</Buttino></Link>
      ))}
      </div>
      <div className="md:hidden gap-2 flex">
  {Todos.map((todo, index) => (
    <Link to={todo.path} key={index} className="relative group flex items-center">
      <Buttino>{todo.icon}</Buttino>

      <span className="
        absolute left-1/2 -translate-x-1/2 -top-8
        bg-black text-white text-xs px-2 py-1 rounded
        opacity-0 group-hover:opacity-100
        pointer-events-none whitespace-nowrap
        transition-all duration-200
      ">
        {todo.name}
      </span>
    </Link>
  ))}
</div>

    </div>
  );
};

export default Interacto;
