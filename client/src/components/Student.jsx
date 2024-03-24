import { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import TeacherItem from "./TeacherItem";
import { onAuthStateChanged } from "firebase/auth";

const Student = () => {
  const ctx = useContext(Context);
  const [name, setName] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [nameSet, setNameSet] = useState(false);
  const [items, setItems] = useState([]);

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

  const fetchItems = () => {
    const docs = query(collection(db, "items"));

    const items = getDocs(docs).then((e) => {
      setItems(() => {
        const result = [];
        e.forEach((doc) => {
          result.push({
            requestedBy: doc.data().requestedBy,
          });
        });
        console.log(result);
        return result;
      });
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      ctx.setUser(user);
      if (!ctx.user) {
        navigate("/login");
      } else {
        fetchTeachers();
        fetchItems();
        console.log(ctx.user.uid);
        const document = getDoc(doc(db, "users", ctx.user.uid)).then((res) => {
          if (res.data().teacher) {
            navigate("/teacher");
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
          <div className="max-w-5xl w-full px-5 py-10 flex flex-col gap-5">
            <div className="text-4xl">Hello, {name}!</div>
            {teachers
              .filter(
                (teacher) =>
                  items.filter((item) => item.requestedBy == teacher.id)
                    .length > 0
              )
              .map((teacher) => (
                <TeacherItem
                  teacher={`${teacher.first} ${teacher.last}`}
                  room={teacher.room}
                  id={teacher.id}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Student;
