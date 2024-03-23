import { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { db } from "../firebase";
import { Context } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);

  const ctx = useContext(Context);

  useEffect(() => {
    if (ctx.user) {
      navigate("/");
    }
  }, []);

  const navigate = useNavigate();

  const authSignUp = (e) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        onAuthStateChanged(auth, (user) => {
          ctx.setUser(user);
          navigate("/");
        });

        const user = userCredential.user;

        setDoc(doc(db, "users", user.uid), {
          first: firstName,
          last: lastName,
          teacher: isTeacher,
          room: roomNumber,
        });

        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        switch (errorCode) {
          case "auth/email-already-in-use":
            setErrorMsg("Email is already in use.");
            break;
          case "auth/weak-password":
            setErrorMsg("Please create a password 6 characters or greater.");
            break;
        }
      });
  };

  return (
    <div className="flex w-full justify-center px-5 py-10">
      <form
        className="flex flex-col max-w-3xl w-full gap-5 p-10 bg-neutral-900 rounded-md"
        onSubmit={authSignUp}
      >
        <div className="text-center pb-5">
          <h1 className="text-5xl">Signup</h1>
        </div>
        <input
          className="p-2 bg-neutral-800"
          type="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="p-2 bg-neutral-800"
          type="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
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
        {isTeacher && (
          <input
            className="p-2 bg-neutral-800 w-full"
            type="text"
            placeholder="Room Number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
        )}
        <h1 className="text-left">
          I am a{" "}
          <button
            className="text-blue-300"
            type="button"
            onClick={() => setIsTeacher(!isTeacher)}
          >
            {isTeacher ? "teacher" : "student"}
          </button>
        </h1>
        <button
          type="submit"
          className="transition ease-in-out delay-150 bg-blue-500/75 hover:bg-blue-500/100 duration-300 py-3 px-6 rounded-lg"
        >
          Signup
        </button>
        {errorMsg && <h1 className="text-red-300">{errorMsg}</h1>}
        <h1 className="text-center">
          Already a member?{" "}
          <Link to="/login" className="text-blue-300">
            Login
          </Link>
        </h1>
      </form>
    </div>
  );
};
export default Signup;
