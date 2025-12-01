// @ts-ignore
import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onStartRecognition: () => void;
  onStopRecognition: () => void;
  recognizing: boolean;
  onSpeak: (text: string) => void;
  speakText: string;
};

export default function SearchBar({
  value,
  onChange,
  onStartRecognition,
  onStopRecognition,
  recognizing,
  onSpeak,
  speakText,
}: Props) {
  return (
    <div
      className="searchbar"
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <input
        type="text"
        placeholder="Type or say what you want to find..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          padding: "12px 14px",
          fontSize: 18,
          borderRadius: 10,
          border: "1px solid #ccc",
        }}
      />

      {/* BIG SPEAK BUTTON */}
      <button
        onClick={() =>
          recognizing ? onStopRecognition() : onStartRecognition()
        }
        style={{
          background: recognizing ? "#ff4d4d" : "#4CAF50",
          color: "white",
          border: "none",
          padding: "14px 20px",
          fontSize: 20,
          borderRadius: 12,
          cursor: "pointer",
          fontWeight: 700,
          minWidth: 120,
        }}
      >
        {recognizing ? "Stop" : "Say a Book Name"}
      </button>

    </div>
  );
}
