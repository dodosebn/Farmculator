import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;


const headers = () => {
    if (user) {
  const email = user.email;
  console.log(email);
}
  return (
    <div>headers</div>
  )
}

export default headers