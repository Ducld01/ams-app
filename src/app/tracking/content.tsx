"use client";

import { Progress } from "antd";
import { useEffect, useState } from "react";

export const Content = ({ url }: { url?: string }) => {
  const [percent, setPercent] = useState(0);
  const [showLink, setShowLink] = useState(false);

  useEffect(() => {
    if (!url) {
      return;
    }

    if (typeof window !== "undefined") {
      const duration = 1500;
      const step = 10;
      const intervalTime = duration / (100 / step);
      const interval = setInterval(() => {
        setPercent((prev) => {
          const next = prev + step;
          if (next >= 100) {
            clearInterval(interval); //
            setShowLink(true);
            setTimeout(() => {
              window.location.href = url;
            }, 1000);
          }
          return Math.min(next, 100);
        });
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, [url]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px 20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "10px",
            color: "#333",
          }}
        >
          Redirect Page
        </h1>
        <p style={{ fontSize: "16px", marginBottom: "20px", color: "#555" }}>
          This is a redirect page
        </p>
        <Progress
          percent={percent}
          style={{ marginBottom: "20px" }}
          status="active"
        />
        {showLink && (
          <p style={{ fontSize: "14px", marginTop: "20px", color: "#555" }}>
            Redirecting to:{" "}
            <a
              href={url}
              style={{
                color: "#1890ff",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              {url}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};
