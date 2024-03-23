import { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { Context } from "../App";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const ctx = useContext(Context);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (ctx.user) {
      navigate("/");
    }
  }, []);

  const authSignIn = (e) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        onAuthStateChanged(auth, (user) => {
          ctx.setUser(user);
          navigate("/");
        });
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        switch (errorCode) {
          case "auth/user-not-found":
            alert("No account found with email.");
            break;
          case "auth/wrong-password":
            alert("Incorrect password");
            break;
        }
      });
  };

  return (
    <div className="flex w-full justify-center px-5 py-10">
      <form
        className="flex flex-col max-w-3xl w-full gap-5 p-10 bg-neutral-900 rounded-md"
        onSubmit={authSignIn}
      >
        <div className="text-center pb-5">
          <h1 className="text-5xl">Login</h1>
        </div>
        <input
          className="p-2 bg-neutral-800"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="p-2 bg-neutral-800"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="p-2 bg-neutral-700 hover:bg-neutral-500 transition-all"
        >
          Login
        </button>
        <h1 className="text-center">
          Not a member?{" "}
          <Link to="/signup" className="text-blue-300">
            Sign up
          </Link>
        </h1>
      </form>
    </div>
  );
};

export default Login;
