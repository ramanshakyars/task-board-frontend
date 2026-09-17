import { useEffect, useState } from "react";
import LoaderService from "../services/LoaderService";

function Loader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return LoaderService.subscribe(setLoading);
  }, []);

  if (!loading) {
    return null;
  }

  return (
    <div className="global-loader">
      <div
        className="spinner-border text-primary"
        role="status"
      >
        <span className="visually-hidden">
          Loading...
        </span>
      </div>

    </div>
  );
}

export default Loader;