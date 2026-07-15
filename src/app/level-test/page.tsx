import { Metadata } from "next";
import LevelTestClient from "./LevelTestClient";

export const metadata: Metadata = {
  title: "수준진단",
  description: "AI업무학교 20문항 수준진단으로 자신의 학습 유형을 점검하고 바로 시작할 강의를 추천받으세요.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/level-test" },
};

export default function LevelTestPage() {
  return <LevelTestClient />;
}
