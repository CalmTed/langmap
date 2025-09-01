import { LANG_LEVEL } from "../../constants";
import type { TopicModel } from "../../models";
import { A1Topics } from "./A1";
import { A2Topics } from "./A2";

export const topicsEN = [
    ...A1Topics,
    ...A2Topics,
]

export const questionsEN = topicsEN.map(t => t.questions).flat()