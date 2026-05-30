import { lessonsCourse1 } from "./lessons-course1";
import { lessonsCourse2 } from "./lessons-course2";
import { lessonsCourse3 } from "./lessons-course3";
import { lessonsCourse4 } from "./lessons-course4";
import { lessonsCourse5 } from "./lessons-course5";
import { lessonsCourse6 } from "./lessons-course6";
import type { Lesson } from "./lessons-course1";

export type { Lesson };

export const lessons: Record<string, Lesson> = {
  ...lessonsCourse1,
  ...lessonsCourse2,
  ...lessonsCourse3,
  ...lessonsCourse4,
  ...lessonsCourse5,
  ...lessonsCourse6,
};
