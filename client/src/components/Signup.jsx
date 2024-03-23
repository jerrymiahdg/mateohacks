import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authSignUp = (e) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <div className="flex w-full justify-center px-5 py-10">
      <form
        className="flex flex-col max-w-3xl w-full gap-5 p-10 bg-neutral-900 rounded-md"
        onSubmit={authSignUp}
      >
        <div className="pb-5">
          <h1 className="text-5xl">Signup</h1>
        </div>
        <input
          className="p-2 bg-neutral-800"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="p-2 bg-neutral-800"
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="p-2 bg-neutral-700 hover:bg-neutral-500 transition-all"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
