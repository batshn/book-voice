import React from "react";

export interface CatalogCategory {
  id: string;
  name: string;
  imageUrl: string;
  webUrl: string;
}

interface CatalogGridProps {
  categories: CatalogCategory[];
  onOpen: (url: string) => void;
}

const CatalogGrid: React.FC<CatalogGridProps> = ({ categories, onOpen }) => {
  return (
    <div className="grid">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "22px",
          marginTop: "20px",
        }}
      >
        {categories.map((c) => (
          <div
            key={c.id}
            className="category-card"
            onClick={() => onOpen(c.webUrl)}
            style={{ userSelect: "none" }}
          >
            <img
              src={c.imageUrl}
              alt={c.name}
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.png";
              }}
            />
            <div className="category-card-name">{c.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogGrid;
