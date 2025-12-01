// @ts-ignore
import React, { useEffect, useState, useRef } from "react";
import type { Category } from "./types";
import { loadCatalogXml } from "./utils/parseXml";
import SearchBar from "./components/SearchBar";
import CatalogGrid from "./components/CatalogGrid";

const useSpeechRecognition = (onResult: (text: string) => void) => {
  const recognitionRef = useRef<any | null>(null);
  const [recognizing, setRecognizing] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(" ");
      onResult(transcript);
    };
    rec.onend = () => {
      setRecognizing(false);
    };
    rec.onerror = (err: any) => {
      console.error("Speech recognition error", err);
      setRecognizing(false);
    };
    recognitionRef.current = rec;
  }, [onResult]);

  const start = () => {
    const rec = recognitionRef.current;
    if (!rec) return false;
    try {
      rec.start();
      setRecognizing(true);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  const stop = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    try {
      rec.stop();
      setRecognizing(false);
    } catch (e) {
      console.error(e);
    }
  };

  return { start, stop, recognizing, supported: !!recognitionRef.current };
};

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadCatalogXml("/catalog.xml")
      .then((cats) => {
        setCategories(cats);
      })
      .catch((err) => {
        console.error(err);
        //setMessage("Failed to load catalog.xml — check public/catalog.xml");
        setMessage("Failed to load catalog.xml — check public/catalog.xml");
      })
      .finally(() => setLoading(false));
  }, []);

  const onResult = (text: string) => {
    setFilter(text);
  };

  const { start, stop, recognizing, supported } = useSpeechRecognition(onResult);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(filter.trim().toLowerCase())
  );

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech not supported in this browser");
      return;
    }
    const utter = new SpeechSynthesisUtterance(text || "No text to speak");
    // you can tune voice, pitch, rate, etc. here
    utter.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const openUrl = (url: string) => {
    if (!url) {
      setMessage("No URL available.");
      return;
    }
    // ensure URL has http(s)
    let final = url;
    if (!/^https?:\/\//i.test(final)) {
      final = "https://" + final;
    }
    window.open(final, "_blank", "noopener");
  };

  return (
    <div style={{ padding: 16, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 6 }}>ENDRES ROAD ELEMENTARY SCHOOL</h1>
     

      <SearchBar
        value={filter}
        onChange={(v) => setFilter(v)}
        onStartRecognition={() => {
          if (!supported) {
            alert(
              "Speech recognition not supported in this browser. Chrome on desktop is recommended. iPad Safari doesn't support speech recognition."
            );
            return;
          }
          const ok = start();
          if (!ok) setMessage("Unable to start recognition.");
        }}
        //onStopRecognition={() => stop()}
          onStopRecognition={() => {
              stop();
              setFilter("");    // ← CLEAR SEARCH TEXT
          }}

        recognizing={recognizing}
        onSpeak={(text) => {
          // if text empty speak a hint or first match name
          if (!text) {
            if (filtered[0]) speak(filtered[0].name);
            else speak("No text available");
          } else speak(text);
        }}
        speakText={filter || (filtered[0] ? filtered[0].name : "")}
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div>No categories match your search.</div>
          ) : (
            <CatalogGrid
              categories={filtered}
              onOpen={(url) => {
                openUrl(url);
              }}
            />
          )}
        </>
      )}

      {message && (
        <div style={{ marginTop: 12, color: "crimson" }}>
          {message}
          <button onClick={() => setMessage(null)} style={{ marginLeft: 8 }}>
            Dismiss
          </button>
        </div>
      )}

      <footer style={{ marginTop: 24, color: "#999", fontSize: 13 }}>
     
      </footer>
    </div>
  );
}
