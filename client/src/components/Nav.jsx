import { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../App";

const Nav = () => {
  const ctx = useContext(Context);

  return (
    <div className="flex w-full justify-center border-b border-neutral-800">
      <div className="flex w-full max-w-5xl justify-between gap-10 p-5">
        <Link to="/">Website</Link>
        <div className="flex gap-10">
          {!ctx.user && (
            <>
              <Link to="login">Login</Link>
              <Link to="signup">Signup</Link>
            </>
          )}
          {ctx.user && (
            <>
              <button>Logout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
