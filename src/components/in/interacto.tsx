import Buttino from "./customs/buttino";

const Interacto = () => {
  const Todos = [
    { name: "Track Sales" },
    { name: "Manage Records" },
    { name: "Chat With AI Farm Advisor" },
    { name: "Yield Predictor" },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-lg font-semibold">What do you want to do today!</p>
      <div className="flex gap-2">
      {Todos.map((todo, index) => (
        <Buttino key={index}>{todo.name}</Buttino>
      ))}
      </div>
    </div>
  );
};

export default Interacto;
