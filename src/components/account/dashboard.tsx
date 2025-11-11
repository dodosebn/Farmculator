import AuthUI from "./authUI";

const Dashboard = () => {
  return (
    <div
        style={{
        backgroundImage: "url('/img/account-side.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <AuthUI />
    </div>
  );
};

export default Dashboard;
