import type { PAGE } from "./constants";

export const go: (page: PAGE) => void = (page) => {
    window.location.hash = page
} 