import { create } from "zustand";

type SelectedPlant = {
  id: string;
  commonName: string;
  image?: string;
};

type GardenForm = {
  name: string;
  spaceType: string;
  area: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  sunlight: string;
  water: string;
  planting: SelectedPlant[];
};

type GardenState = {
  form: GardenForm;

  setField: (key: keyof GardenForm, value: any) => void;
  setLocation: (lat: number, lon: number) => void;

  setPlanting: (plants: SelectedPlant[]) => void;
  togglePlant: (plant: SelectedPlant) => void;

  resetForm: () => void;
};

export const useGardenStore = create<GardenState>((set) => ({
  form: {
    name: "",
    spaceType: "",
    area: "",
    location: "",
    latitude: null,
    longitude: null,
    sunlight: "",
    water: "",
    planting: [],
  },

  setField: (key, value) =>
    set((state) => ({
      form: { ...state.form, [key]: value },
    })),

  setLocation: (lat, lon) =>
    set((state) => ({
      form: {
        ...state.form,
        latitude: lat,
        longitude: lon,
        location: "Detected Location",
      },
    })),

  setPlanting: (plants) =>
    set((state) => ({
      form: {
        ...state.form,
        planting: plants,
      },
    })),

  togglePlant: (plant) =>
    set((state) => {
      const exists = state.form.planting.find((p) => p.id === plant.id);

      if (exists) {
        return {
          form: {
            ...state.form,
            planting: state.form.planting.filter(
              (p) => p.id !== plant.id
            ),
          },
        };
      }

      return {
        form: {
          ...state.form,
          planting: [...state.form.planting, plant],
        },
      };
    }),

  resetForm: () =>
    set({
      form: {
        name: "",
        spaceType: "",
        area: "",
        location: "",
        latitude: null,
        longitude: null,
        sunlight: "",
        water: "",
        planting: [],
      },
    }),
}));