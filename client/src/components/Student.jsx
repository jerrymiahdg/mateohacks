import { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import TeacherItem from "./TeacherItem";

const Student = () => {
  const ctx = useContext(Context);
  const [name, setName] = useState("Ronak");

  const dummyItems = [
    {
      name: "Tissue Boxes",
      quantity: 4,
    },
    {
      name: "Paper",
      quantity: 400,
    },
    {
      name: "Tissues",
      quantity: 5,
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    if (!ctx.user) {
      navigate("/login");
    } else {
      console.log(ctx.user.uid);
      const document = getDoc(doc(db, "users", ctx.user.uid)).then((res) => {
        if (res.data().teacher) {
          navigate("/teacher");
        } else {
          setName(res.data().first);
        }
      });
    }
  }, []);

  return (
    <div className="flex w-full justify-center">
      <div className="max-w-5xl w-full px-5 py-10 flex flex-col gap-5">
        <div className="text-4xl">Hello, {name}</div>
        <div className="flex justify-between">
          <div>Teacher</div>
          <div>Number of Items Requested</div>
        </div>
        <TeacherItem teacher="Ms. Downum" room="X" items={dummyItems} />
        <TeacherItem teacher="Ms. Nguyen" room="L06" items={dummyItems} />
        <TeacherItem teacher="Ms. Tsang" room="P15" items={dummyItems} />
      </div>
    </div>
  );
};

export default Student;
