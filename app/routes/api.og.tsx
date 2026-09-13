import { createFileRoute } from "@tanstack/react-router";
import { ImageResponse } from "workers-og";

let cachedInterFont: ArrayBuffer | null = null;
let cachedSerifFont: ArrayBuffer | null = null;

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { searchParams } = new URL(request.url);
          const groom = searchParams.get("groom") || "Shin";
          const bride = searchParams.get("bride") || "Lena";
          const date = searchParams.get("date") || "";
          const time = searchParams.get("time") || "";
          const venueLabel = searchParams.get("venueLabel") || "";
          const venueAddress = searchParams.get("venueAddress") || "";
          const oldVenue = searchParams.get("venue") || "";
          const photo = searchParams.get("photo") || "";

          if (!cachedInterFont) {
            try {
              const fontResp = await fetch(
                "https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/Inter-Bold.woff"
              );
              if (fontResp.ok) cachedInterFont = await fontResp.arrayBuffer();
            } catch (e) {
              console.error("Failed to fetch Inter font", e);
            }
          }

          if (!cachedSerifFont) {
            try {
              const fontResp = await fetch(
                "https://raw.githubusercontent.com/fontsource/font-files/main/fonts/google/playfair-display/700-normal.woff"
              );
              if (fontResp.ok)
                cachedSerifFont = await fontResp.arrayBuffer();
            } catch (e) {
              console.error("Failed to fetch Serif font", e);
            }
          }

          const showPhoto =
            photo &&
            (photo.startsWith("http://") || photo.startsWith("https://"));

          const fonts: any[] = [];
          if (cachedInterFont) {
            fonts.push({
              name: "sans-serif",
              data: cachedInterFont,
              weight: 700,
              style: "normal",
            });
          }
          if (cachedSerifFont) {
            fonts.push({
              name: "serif",
              data: cachedSerifFont,
              weight: 700,
              style: "normal",
            });
          }

          const line1Parts = [date, venueLabel].filter(Boolean);
          const line1 = line1Parts.join(" • ");

          let line2 = "";
          if (time || venueAddress) {
            const line2Parts = [time, venueAddress].filter(Boolean);
            line2 = line2Parts.join(" • ");
          } else if (oldVenue && !venueLabel) {
            line2 = oldVenue;
          }

          return new ImageResponse(
            (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "1200px",
                  height: "630px",
                  padding: "70px",
                  background: "#F8F6F3",
                  fontFamily: "sans-serif",
                }}
              >
                {/* Left Column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "48%",
                  }}
                >
                  {/* Logo */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "30px",
                    }}
                  >
                    <img
                      src="https://ds1-navy.vercel.app/favicon.svg"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginRight: "12px",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "#333",
                      }}
                    >
                      Baswara
                    </div>
                  </div>

                  {/* Badge */}
                  <div style={{ display: "flex", marginBottom: "25px" }}>
                    <div
                      style={{
                        display: "flex",
                        padding: "8px 20px",
                        background: "#F6E7DE",
                        color: "#BE6543",
                        borderRadius: "999px",
                        fontWeight: 600,
                        fontSize: "16px",
                      }}
                    >
                      Undangan Digital
                    </div>
                  </div>

                  {/* Heading */}
                  <div
                    style={{
                      fontFamily: "serif",
                      fontSize: "56px",
                      lineHeight: 1.1,
                      color: "#222222",
                      marginBottom: "30px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ display: "flex" }}>Undangan Pernikahan</div>
                    <div style={{ display: "flex" }}>
                      {groom} & {bride}
                    </div>
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      fontSize: "24px",
                      lineHeight: 1.5,
                      color: "#666666",
                      marginBottom: "40px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {line1 ? (
                      <div style={{ display: "flex" }}>{line1}</div>
                    ) : null}
                    {line2 ? (
                      <div style={{ display: "flex" }}>{line2}</div>
                    ) : null}
                  </div>

                  {/* Button */}
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        display: "flex",
                        background: "#BE6543",
                        color: "#ffffff",
                        padding: "18px 34px",
                        borderRadius: "12px",
                        fontSize: "24px",
                        fontWeight: 700,
                      }}
                    >
                      Buka Undangan
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div
                  style={{
                    display: "flex",
                    width: "45%",
                    height: "520px",
                    borderRadius: "24px",
                    border: "3px solid #D78B73",
                    overflow: "hidden",
                    background: "#e0dcd5",
                  }}
                >
                  {showPhoto ? (
                    <img
                      src={photo}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "60px",
                        color: "#a39b8e",
                      }}
                    >
                      💍
                    </div>
                  )}
                </div>
              </div>
            ),
            {
              width: 1200,
              height: 630,
              fonts: fonts.length > 0 ? fonts : undefined,
            }
          );
        } catch (e: any) {
          console.log(`${e.message}`);
          return new Response(`Failed to generate the image`, {
            status: 500,
          });
        }
      },
    },
  },
});
