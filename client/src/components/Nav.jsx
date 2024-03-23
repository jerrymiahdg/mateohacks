import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../App";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Nav = () => {
  const ctx = useContext(Context);
  const navigate = useNavigate();

  const logOut = () => {
    signOut(auth)
      .then(() => {
        onAuthStateChanged(auth, (user) => {
          ctx.setUser(user);
          navigate("/login");
        });
      })
      .catch((error) => {});
  };

  return (
    <div className="flex w-full justify-center border-b border-neutral-800">
      <div className="flex w-full max-w-5xl justify-between gap-10 p-5 items-center">
        <Link to="/" className="font-bold text-4xl">
          HelpYourTeacher.com
        </Link>
        <div className="flex gap-10">
          {!ctx.user && (
            <>
              <Link to="login">Login</Link>
              <Link to="signup">Signup</Link>
            </>
          )}
          {ctx.user && (
            <>
              <button onClick={logOut}>Logout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
