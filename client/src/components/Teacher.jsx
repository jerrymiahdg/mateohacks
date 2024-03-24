import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../App";
import {
  doc,
  getDoc,
  getDocs,
  where,
  query,
  collection,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Teacher = () => {
  const [name, setName] = useState("");

  const [nameSet, setNameSet] = useState(false);

  const [room, setRoom] = useState("");

  const [items, setItems] = useState([]);

  const [students, setStudents] = useState([]);

  const ctx = useContext(Context);

  const navigate = useNavigate();

  const fetchItems = () => {
    const docs = query(
      collection(db, "items"),
      where("requestedBy", "==", ctx.user.uid)
    );

    const items = getDocs(docs).then((e) => {
      setItems(() => {
        const result = [];
        e.forEach((doc) => {
          result.push({
            name: doc.data().name,
            price: doc.data().price,
            id: doc.id,
            quantity: doc.data().quantity,
            studentDonating: doc.data().studentDonating,
            quantityDonating: doc.data().quantityDonating,
          });
        });
        return result;
      });
    });
  };

  const fetchRoom = () => {
    const docs = query(doc(db, "users", ctx.user.uid));
    const items = getDoc(docs).then((e) => {
      console.log(e);
      setRoom(e.data().room);
    });
  };

  const fetchStudents = () => {
    const docs = query(collection(db, "users"), where("teacher", "==", false));
    const students = getDocs(docs).then((e) => {
      console.log(e);
      setStudents(() => {
        const result = [];
        e.forEach((doc) => {
          result.push({
            id: doc.id,
            first: doc.data().first,
            last: doc.data().last,
            donateCount: doc.data().donateCount,
          });
        });
        return result;
      });
    });
  };

  const confirmDonation = (id) => () => {
    const item = items.filter((item) => item.id == id)[0];

    updateDoc(doc(db, "users", item.studentDonating), {
      donateCount: increment(item.quantityDonating),
    });
    // increase student prop donated by 1
    const difference = item.quantity - item.quantityDonating;
    console.log("item.quantity: " + item.quantity);
    console.log("item.quantityDonating: " + item.quantityDonating);

    if (difference <= 0) {
      //check if no items left
      removeItem(id);
    } else {
      updateDoc(doc(db, "items", id), {
        studentDonating: "",
        quantity: difference,
        quantityDonating: 0,
      }).then(() => fetchItems());
    }
  };

  const removeItem = (e) => {
    deleteDoc(doc(db, "items", e)).then(() => fetchItems());
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      ctx.setUser(user);
      if (!ctx.user) {
        navigate("/login");
      } else {
        fetchItems();
        fetchStudents();
        fetchRoom();
        console.log(ctx.user.uid);
        const document = getDoc(doc(db, "users", ctx.user.uid)).then((res) => {
          if (!res.data().teacher) {
            navigate("/");
          } else {
            setName(res.data().first);
            setNameSet(true);
          }
        });
      }
    });
  }, []);

  return (
    <>
      {nameSet && (
        <div className="flex w-full justify-center">
          <div className="flex flex-col max-w-5xl w-full px-5 py-10 gap-10">
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl">Good afternoon, {name}!</h1>
              <h1 className="text-neutral-500">{room}</h1>
            </div>
            <div className="flex flex-col md:flex-row w-full gap-5">
              <div className="w-full flex gap-2 flex-col">
                <h1>Requested Items</h1>
                <div className="flex flex-col border w-full border-neutral-800">
                  {items.map((item) => (
                    <div className="flex justify-between p-3 items-center w-full border-b border-neutral-800">
                      <h1 className="text-2xl font-bold">{item.name}</h1>
                      <div className="flex gap-5 items-center">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between gap-5 items-center">
                            <h1 className="text-sm">Quantity</h1>
                            <h1 className="text-xl">{item.quantity}</h1>
                          </div>
                          <div className="flex justify-between gap-5 items-center">
                            <h1 className="text-sm">Price</h1>
                            <h1 className="text-xl">{item.price}</h1>
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.id)}>
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
                  ))}
                  <Link
                    to="/add-item"
                    className="w-full text-center bg-neutral-900 hover:bg-neutral-800 p-3"
                  >
                    Add Item
                  </Link>
                </div>
              </div>
              <div className="w-full flex gap-2 flex-col">
                <h1>Students</h1>
                <div className="flex flex-col border-x border-t w-full border-neutral-800">
                  {students
                    .filter((student) => items.filter(
                          (item) => item.studentDonating == student.id
                        ).length > 0
                    )
                    .map((student) => (
                      <div className="flex justify-between items-center border-b border-neutral-800 p-5">
                        <div className="flex-col gap-5">
                          <h1 className="text-xl font-bold">
                            {student.first} {student.last[0].toUpperCase()}.
                          </h1>
                          <div className="flex justify-between gap-5 items-center">
                            <h1 className="text-sm">Donated</h1>
                            <h1 className="text-xl">{student.donateCount}</h1>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          {items
                            .filter(
                              (item) => item.studentDonating == student.id
                            )
                            .map((item, i, arr) => (
                              <div
                                className={`flex flex-col gap-2 items-center ${
                                  i !== arr.length - 1 && "border-b"
                                } border-neutral-800 p-5`}
                              >
                                <h1 className="text-green-200">
                                  Wants to donate {item.quantityDonating}{" "}
                                  {item.name}!
                                </h1>
                                <button
                                  className="bg-neutral-900 p-1 text-sm rounded-sm opacity-90 hover:opacity-100 w-full"
                                  onClick={confirmDonation(item.id)}
                                >
                                  Confirm
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
                {students.filter(
                  (student) =>
                    items.filter((item) => item.studentDonating == student.id)
                      .length > 0
                ).length <= 0 && <h1>No students currently donating 😢</h1>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Teacher;
