import { useState } from "react";
import { useEffect } from "react";
import ClothingCarousel from "./components/ClothingCarousel";
import "./App.css";
import { db } from "./db";


export default function App() {
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);

  // Load saved clothes when the app starts
  useEffect(() => {
    async function loadClothes() {
      const tops = await db.clothes.where("type").equals("top").toArray();
      const bottoms = await db.clothes.where("type").equals("bottom").toArray();

      setTops(tops);
      setBottoms(bottoms);
    }

    loadClothes();
  }, []);

  // Save whenever tops change


  const handleUpload = async (e, type) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      const reader = new FileReader();

      reader.onload = async () => {
        const image = {
          type,
          name: file.name,
          url: reader.result,
        };

        const id = await db.clothes.add(image);

        image.id = id;

        if (type === "top") {
          setTops((prev) => [...prev, image]);
        } else {
          setBottoms((prev) => [...prev, image]);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const deleteClothing = async (id, type) => {
  await db.clothes.delete(id);

  if (type === "top") {
    setTops((prev) => prev.filter((item) => item.id !== id));
  } else {
    setBottoms((prev) => prev.filter((item) => item.id !== id));
  }
};

  const shuffle = () => {
    if (tops.length > 1) {
      setTops((prev) => [...prev].sort(() => Math.random() - 0.5));
    }

    if (bottoms.length > 1) {
      setBottoms((prev) => [...prev].sort(() => Math.random() - 0.5));
    }
  };
  console.log("Tops:", tops);
  console.log("Bottoms:", bottoms);
  return (
    <div className="app">
      <header className="header">
        <h1>My Closet</h1>
        <p>Create outfits by swiping through your clothes.</p>
      </header>

      <section className="section">
        <div className="section-title">
          <h2>Tops</h2>

          <label className="upload">
            + Add
            <input
              type="file"
              accept="image/*"
              hidden
              multiple
              onChange={(e) => handleUpload(e, "top")}
            />
          </label>
        </div>

        {tops.length > 0 ? (
          <ClothingCarousel
    items={tops}
    type="top"
    onDelete={deleteClothing}
/>
        ) : (
          <div className="placeholder">
            Upload some tops 👕
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Bottoms</h2>

          <label className="upload">
            + Add
            <input
              type="file"
              accept="image/*"
              hidden
              multiple
              onChange={(e) => handleUpload(e, "bottom")}
            />
          </label>
        </div>

        {bottoms.length > 0 ? (
          <ClothingCarousel
    items={bottoms}
    type="bottom"
    onDelete={deleteClothing}
/>
        ) : (
          <div className="placeholder">
            Upload some bottoms 👖
          </div>
        )}
      </section>

      <div className="buttons">
        <button onClick={shuffle}>🎲 Shuffle</button>
        <button>❤️ Save Outfit</button>
      </div>
    </div>
  );
}