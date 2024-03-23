import { useState } from "react";
import expandIcon from "../assets/expand_icon.png";

const TeacherItem = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-neutral-800 w-full p-5 flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <p className="font-bold text-lg">{props.teacher}</p>
          <p className="text-neutral-500">{props.room}</p>
        </div>
        <div className="flex gap-5">
          <p>{props.items.length}</p>
          <button
            onClick={() => setOpen((open) => !open)}
            className={`material-symbols-outlined ${open ? "rotate-180" : ""}`}
          >
            expand_more
          </button>
        </div>
      </div>
      <div
        className={`max-h-0 h-full overflow-hidden flex gap-5 transition-all ${
          open && "max-h-16 mt-5"
        }`}
      >
        {props.items &&
          props.items.map((item) => (
            <div className="bg-neutral-800 rounded-lg p-5">
              <div>{item.name}</div>
              <div className="text-sm text-center text-neutral-600">
                {item.quantity}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TeacherItem;
