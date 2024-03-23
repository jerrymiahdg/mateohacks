import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../App";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Teacher = () => {
  const [name, setName] = useState("Ms. Tsang");

  const ctx = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    if (!ctx.user) {
      navigate("/login");
    } else {
      console.log(ctx.user.uid);
      const document = getDoc(doc(db, "users", ctx.user.uid)).then((res) => {
        if (!res.data().teacher) {
          navigate("/");
        } else {
          setName(res.data().first);
        }
      });
    }
  }, []);

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col max-w-5xl w-full px-5 py-10 gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl">Good afternoon, {name}!</h1>
          <h1 className="text-neutral-500">P16</h1>
        </div>
        <div className="flex flex-col md:flex-row w-full gap-5">
          <div className="w-full flex gap-2 flex-col">
            <h1>Requested Items</h1>
            <div className="flex flex-col border w-full border-neutral-800">
              <div className="flex justify-between p-3 items-center w-full">
                <h1>Tissues</h1>
                <div className="flex gap-5 items-center">
                  <h1>Quantity</h1>
                  <h1 className="text-xl">25</h1>
                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 -960 960 960"
                      width="24"
                      className=" fill-neutral-700"
                    >
                      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                  </button>
                </div>
              </div>
              <Link
                to="/add-item"
                className="w-full text-center bg-neutral-900 hover:bg-neutral-800 p-2"
              >
                Add Item
              </Link>
            </div>
          </div>
          <div className="w-full flex gap-2 flex-col">
            <h1>Students</h1>
            <div className="flex flex-col p-5 border w-full border-neutral-800">
              <div className="flex justify-between items-center">
                <div className="flex-col gap-5">
                  <h1 className="text-xl font-bold">Jeremiah D.</h1>
                  <div className="flex justify-between gap-5 items-center">
                    <h1 className="text-sm">Donated</h1>
                    <h1 className="text-xl">25</h1>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <h1 className="text-xl text-green-200">
                    Wants to donate tissues!
                  </h1>
                  <button className="bg-neutral-900 p-2 rounded-sm opacity-90 hover:opacity-100 w-full">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teacher;
