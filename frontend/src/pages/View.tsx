import React, { useEffect, useState } from "react";
import { RouteProps, useNavigate } from "react-router";
import axios from "../axios";
import Result from "./Result";
import Start from "./Start";
import Back from "../components/Back";
import WaitingToEnd from "../components/WaitingToEnd";

const View = (props: RouteProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<"not-started" | "running" | "finished">(
    "not-started"
  );

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/polls/status")
      .then((res) => {
        setStatus(res.data.status);
        console.log("status:",status)
        setLoading(false);
      })
      .catch((error) => console.log({ error }));
  }, []);

  let comp = <div></div>;

  if (loading) return comp;

  if (status === "finished") comp = <Result />;
  if (status === "running") comp = <WaitingToEnd/>;
  if (status === "not-started") comp = <Start />;

  return (
  <div className="view-container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
  <Back call={() => navigate("/")} />
    <div>{comp}</div>
    </div>
  );
  
  

};

export default View;
