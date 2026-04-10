import { useWeatherStore } from "@/store/weatherStore";

export const fetchWeather = async (lat: number, lon: number) => {
  const setWeather = useWeatherStore.getState().setWeather;
  const setFetching = useWeatherStore.getState().setFetchingLocation;

  try {
    setFetching(true);

    const res = await fetch(`/api/service?lat=${lat}&lon=${lon}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    

    if (!res.ok) throw new Error("Failed");

    const data = await res.json();

    setWeather(data); // ✅ update global store
  } catch (err) {
    console.error(err);
  } finally {
    setFetching(false);
  }
};