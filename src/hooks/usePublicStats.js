import { useEffect, useState } from "react";
import api from "../api/axios";

let cache = null;

const usePublicStats = () => {
  const [stats, setStats] = useState(cache);

  useEffect(() => {
    if (cache) return undefined;

    let active = true;

    api
      .get("/public/stats")
      .then(({ data }) => {
        cache = data.stats;
        if (active) setStats(data.stats);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return stats;
};

export default usePublicStats;
