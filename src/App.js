import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [config, setConfig] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState("");

  const API_BASE = 'https://firebase-api-tplg.onrender.com';

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    setConfig(result.config);
  };

  const handleToggleChange = (index, value) => {
    const updated = [...config];
    updated[index].value = value;
    setConfig(updated);
  };

  const handleGenerate = async () => {
    const reader = new FileReader();
    reader.onload = async function () {
      const originalZipHex = Array.from(new Uint8Array(reader.result))
        .map(b => b.toString(16).padStart(2, '0')).join('');

      const response = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalZip: originalZipHex, config })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Firemods Configurator</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".zip" />
      <button onClick={handleUpload} disabled={!file}>Upload & Parse</button>
      <div style={{ marginTop: '1rem' }}>
        {config.map((item, index) => (
          <div key={item.key}>
            <label>{item.key}: </label>
            {item.type === 'boolean' ? (
              <input
                type="checkbox"
                checked={item.value === 'true'}
                onChange={(e) => handleToggleChange(index, e.target.checked ? 'true' : 'false')}
              />
            ) : (
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleToggleChange(index, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <button onClick={handleGenerate} disabled={!config.length}>Generate ZIP</button>
      {downloadUrl && <a href={downloadUrl} download="modified_rise.zip">Download Modified ZIP</a>}
    </div>
  );
}

export default App;
