import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { Context } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";

const AddItem = () => {
  const ctx = useContext(Context);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const addItem = (e) => {
    e.preventDefault();
    addDoc(collection(db, "items"), {
      requestedBy: ctx.user.uid,
      price: price,
      quantity: quantity,
      name: name,
      studentDonating: "",
    }).then(() => {
      navigate("/teacher");
    });
  };

  return (
    <div className="flex w-full justify-center px-5 py-10">
      <form
        className="flex flex-col max-w-3xl w-full gap-5 p-10 bg-neutral-900 rounded-md"
        onSubmit={addItem}
      >
        <div className="text-center pb-5">
          <h1 className="text-5xl">Add Item</h1>
        </div>
        <input
          className="p-2 bg-neutral-800"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="p-2 bg-neutral-800"
          type="number"
          placeholder="Estimated Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="p-2 bg-neutral-800"
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button
          type="submit"
          className="p-2 bg-neutral-700 hover:bg-neutral-500 transition-all"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItem;
