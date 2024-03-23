import { useContext, useEffect, useState } from "react";
import expandIcon from "../assets/expand_icon.png";
import {
  query,
  collection,
  doc,
  getDocs,
  where,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Context } from "../App";

const TeacherItem = (props) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  const ctx = useContext(Context);

  const fetchItems = () => {
    const docs = query(
      collection(db, "items"),
      where("requestedBy", "==", props.id),
      where("studentDonating", "in", ["", ctx.user.uid])
    );
    const items = getDocs(docs).then((e) => {
      console.log(e);
      setItems(() => {
        const result = [];
        e.forEach((doc) => {
          result.push({
            name: doc.data().name,
            price: doc.data().price,
            id: doc.id,
            quantity: doc.data().quantity,
            studentDonating: doc.data().studentDonating,
            quantityInput: 0,
          });
        });
        return result;
      });
    });
  };

  //   const donateItem = (id) => () => {
  //     setDoc(doc(db, "items", id), {
  //       studentDonating: ctx.user.uid,
  //     });
  //   };

  const donateItem = (id, studentDonating) => (e) => {
    if (studentDonating) {
      updateDoc(doc(db, "items", id), {
        studentDonating: "",
        quantityDonating: e,
      }).then(() => {
        fetchItems();
      });
    } else {
      updateDoc(doc(db, "items", id), {
        studentDonating: ctx.user.uid,
        quantityDonating: 0,
      }).then(() => {
        fetchItems();
      });
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="border border-neutral-800 w-full p-5 flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <p className="font-bold text-lg">{props.teacher}</p>
          <p className="text-neutral-500">{props.room}</p>
        </div>
        <div className="flex gap-5">
          <p>{items.length}</p>
          <button
            onClick={() => setOpen((open) => !open)}
            className={`material-symbols-outlined disabled:text-neutral-800 ${
              open ? "rotate-180" : ""
            }`}
            disabled={items.length == 0}
          >
            expand_more
          </button>
        </div>
      </div>
      <div
        className={`max-h-0 h-full overflow-hidden flex gap-5 transition-all ${
          open && "max-h-56 mt-5"
        }`}
      >
        {items &&
          items.map((item) => (
            <div className="p-5 w-40 bg-neutral-900 rounded-md flex flex-col gap-2">
              <div>{item.name}</div>
              <div className="flex justify-between text-sm">
                <div className="text-neutral-600">{item.quantity}</div>
                <div className="text-neutral-500 italic">${item.price}</div>
              </div>
              <input type="number" className="p-1" value={item.quantityInput} />
              <button
                className={`w-full rounded-md text-xs py-2 ${
                  item.studentDonating
                    ? "bg-neutral-600 hover:bg-neutral-500"
                    : "bg-emerald-600 hover:bg-emerald-500"
                }`}
                onClick={donateItem(item.id, item.studentDonating)}
              >
                {item.studentDonating ? "Remove donation" : "I want to donate!"}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TeacherItem;
