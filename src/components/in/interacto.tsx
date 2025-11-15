import { Link } from "@tanstack/react-router";
import Buttino from "./customs/buttino";

const Interacto = () => {
  const Todos = [
    // { name: "Track Sales" },
    { name: "Manage Records", path: '/in/Dashboard' },
    { name: "Chat With AI Farm Advisor", path: '/in/farm-advisor' },
    { name: "Yield Predictor", path: '/in/Dashboard' },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-lg font-semibold">What do you want to do today!</p>
      <div className="flex gap-2">
      {Todos.map((todo, index) => (
       <Link to={todo.path} key={index}><Buttino>{todo.name}</Buttino></Link>
      ))}
      </div>
    </div>
  );
};

export default Interacto;
