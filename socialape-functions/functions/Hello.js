import { useState, useEffect, useContext } from "react";

const DanOnSteroids = (props) => {
  const [danOnSteroids, setdanOnSteroids] = useState();

  useEffect(() => {
    console.log(danOnSteroids);
  }, [danOnSteroids]);

  return <div className={`DanOnSteroids_wrapper`}>danOnSteroids</div>;
};
export default DanOnSteroids;
