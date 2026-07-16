import { ImageResponse } from "next/og";

export const alt = "AI업무학교 - 비개발자를 위한 AI 업무 활용";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 78px",
          background: "#102a2a",
          color: "#f7fbf7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f0b44d",
              color: "#102a2a",
              borderRadius: 8,
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            AI
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 800 }}>
            AI업무학교
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div
            style={{
              display: "flex",
              color: "#f0b44d",
              fontSize: 25,
              fontWeight: 700,
              marginBottom: 22,
            }}
          >
            비개발자를 위한 AI 업무 활용
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 58,
              lineHeight: 1.17,
              fontWeight: 850,
              letterSpacing: 0,
            }}
          >
            <div style={{ display: "flex" }}>기초부터 실무 확장까지,</div>
            <div style={{ display: "flex" }}>직접 써보며 배우는 과정</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 22,
            borderTop: "2px solid #315151",
            color: "#c7d8d2",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex" }}>프롬프트 · 컨텍스트 · 에이전트</div>
          <div style={{ display: "flex" }}>박실로 공인노무사</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
