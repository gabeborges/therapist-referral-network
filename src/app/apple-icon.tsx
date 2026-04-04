import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon(): ImageResponse {
  const cx = 90;
  const cy = 90;
  const stroke = "#2a7c7c";
  const sw = 5;
  const radii = [79, 60, 41, 22];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f4ef",
        position: "relative",
      }}
    >
      {radii.map((r) => (
        <div
          key={r}
          style={{
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            border: `${sw}px solid ${stroke}`,
            position: "absolute",
            left: cx - r,
            top: cy - r,
          }}
        />
      ))}
    </div>,
    { ...size },
  );
}
