import { useEffect, useState } from "react";
import { AuthError } from "@/lib/game.js";
import { fetchCountries } from "@/lib/fetchCountries.js";

export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchCountries()
      .then((data) => {
        if (!active) return;

        setCountries(data);
        setError("");
      })
      .catch((loadError) => {
        if (loadError instanceof AuthError) {
          window.location.replace("/login?next=/game");
          return;
        }

        if (active) setError("No fue posible cargar el archivo cartográfico.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { countries, loading, error };
};
