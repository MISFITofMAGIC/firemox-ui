import React, { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    console.log("Selected file:", e.target.files[0]);
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a ZIP file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log("Uploading...");

    try {
      const response = await fetch("https://firebase-api-tplg.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error("Upload failed: " + errText);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("Received empty file. Check backend logs.");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "modified.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log("Download triggered.");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Firemods ZIP Configurator</h1>
      <input type="file" onChange={handleFileChange} accept=".zip" />
      <button onClick={handleUpload} style={{ marginLeft: "1rem" }}>
        Generate ZIP
      </button>
    </div>
  );
}

export default App;