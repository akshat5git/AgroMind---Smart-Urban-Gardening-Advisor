import { create } from "zustand";

type WeatherData = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
};

type WeatherState = {
  weather: WeatherData | null;
  fetchingLocation: boolean;

  // actions
  setWeather: (data: WeatherData) => void;
  setFetchingLocation: (loading: boolean) => void;
  clearWeather: () => void;
};

export const useWeatherStore = create<WeatherState>((set) => ({
  weather: null,
  fetchingLocation: false,

  setWeather: (data) =>
    set(() => ({
      weather: data,
    })),

  setFetchingLocation: (loading) =>
    set(() => ({
      fetchingLocation: loading,
    })),

  clearWeather: () =>
    set(() => ({
      weather: null,
    })),
}));