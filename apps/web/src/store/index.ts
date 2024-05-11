import { create } from "zustand";
import { BookSlice, createBookSlice } from "@/store/createBookSlice";

export const useBearStore = create<BookSlice>((...a) => {
  return {
    ...createBookSlice(...a),
  }
})
