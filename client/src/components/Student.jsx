import { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import TeacherItem from "./TeacherItem";

const Student = () => {
  const ctx = useContext(Context);
  const [name, setName] = useState("Ronak");
  const [teachers, setTeachers] = useState([]);

  const dummyItems = [
    {
      name: "Tissue Boxes",
      quantity: 4,
      price: 5,
    },
    {
      name: "Paper",
      quantity: 400,
      price: 2,
    },
    {
      name: "Tissues",
      quantity: 5,
      price: 5,
    },
  ];

  const fetchTeachers = () => {
    const docs = query(collection(db, "users"), where("teacher", "==", true));
    const teachers = getDocs(docs).then((e) => {
      console.log(e);
      setTeachers(() => {
        const result = [];
        e.forEach((doc) => {
          result.push({
            id: doc.id,
            first: doc.data().first,
            last: doc.data().last,
            room: doc.data().room,
          });
        });
        console.log(result);
        return result;
      });
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!ctx.user) {
      navigate("/login");
    } else {
      fetchTeachers();
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
        {teachers.map((teacher) => (
          <TeacherItem
            teacher={`${teacher.first} ${teacher.last}`}
            room={teacher.room}
            id={teacher.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Student;
