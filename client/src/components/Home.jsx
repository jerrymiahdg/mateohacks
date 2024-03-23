import { useContext, useEffect } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const ctx = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    if (!ctx.user) {
      navigate("/login");
    }
  }, []);

  return <div></div>;
};

export default Home;
