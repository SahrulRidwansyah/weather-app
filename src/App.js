import { useState } from 'react';

function App() {
  const [kota, setKota] = useState('');
  const [cuaca, setCuaca] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = '7c8b75c24aa5611a34be47d0c4d1d9d9';

  const cariCuaca = async () => {
    if (!kota) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${kota}&appid=${API_KEY}&units=metric&lang=id`
      );
      const data = await response.json();
      if (data.cod !== 200) {
        setError('Kota tidak ditemukan!');
        setCuaca(null);
      } else {
        setCuaca(data);
      }
    } catch (err) {
      setError('Terjadi kesalahan!');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#c9a84c', marginBottom: '30px' }}>🌤️ Weather App</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Masukkan nama kota..."
          value={kota}
          onChange={(e) => setKota(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && cariCuaca()}
          style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', fontSize: '16px', width: '250px' }}
        />
        <button
          onClick={cariCuaca}
          style={{ background: '#c9a84c', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
        >
          Cari
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {cuaca && (
        <div style={{ background: '#1a1a2e', padding: '30px', borderRadius: '16px', textAlign: 'center', minWidth: '300px' }}>
          <h2 style={{ color: '#c9a84c' }}>{cuaca.name}, {cuaca.sys.country}</h2>
          <img src={`https://openweathermap.org/img/wn/${cuaca.weather[0].icon}@2x.png`} alt="cuaca" />
          <h1 style={{ fontSize: '64px', margin: '0' }}>{Math.round(cuaca.main.temp)}°C</h1>
          <p style={{ fontSize: '20px', textTransform: 'capitalize' }}>{cuaca.weather[0].description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
            <div>
              <p style={{ color: '#c9a84c' }}>Kelembaban</p>
              <p>{cuaca.main.humidity}%</p>
            </div>
            <div>
              <p style={{ color: '#c9a84c' }}>Angin</p>
              <p>{cuaca.wind.speed} m/s</p>
            </div>
            <div>
              <p style={{ color: '#c9a84c' }}>Terasa</p>
              <p>{Math.round(cuaca.main.feels_like)}°C</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;