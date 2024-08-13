import { create } from "zustand";
import { BookSlice, createBookSlice } from "@/store/createBookSlice";
import { ConfigSlice, createConfigSlice } from "./createConfigSlice";

export const useBearStore = create<BookSlice & ConfigSlice>((...a) => {
  return {
    ...createBookSlice(...a),
    ...createConfigSlice(...a),
  };
});
