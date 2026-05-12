import './App.css';
import { useState, useEffect } from 'react';
import { WiDaySunny, WiRain, WiCloudy, WiThunderstorm, WiSnow, WiFog, WiDayCloudy } from 'react-icons/wi';

function App() {
  const [kota, setKota] = useState('');
  const [cuaca, setCuaca] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = '7c8b75c24aa5611a34be47d0c4d1d9d9';

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=id`
        );
        const data = await response.json();
        setCuaca(data);
      });
    }
  }, []);

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

  const getTheme = () => {
    if (!cuaca) return {
      bg: 'linear-gradient(180deg, #0d0d0d, #1a1a2e)',
      icon: <WiDayCloudy size={200} color="rgba(255,255,255,0.15)" />,
      iconKecil: <WiDayCloudy size={80} color="#c9a84c" />
    };
    const kondisi = cuaca.weather[0].main.toLowerCase();
    if (kondisi.includes('clear')) return {
      bg: 'linear-gradient(180deg, #1a6faf, #f0a500)',
      icon: <WiDaySunny size={300} color="rgba(255,255,0,0.15)" />,
      iconKecil: <WiDaySunny size={80} color="#FFD700" />
    };
    if (kondisi.includes('cloud')) return {
      bg: 'linear-gradient(180deg, #4a4a6a, #2c2c4e)',
      icon: <WiCloudy size={300} color="rgba(255,255,255,0.15)" />,
      iconKecil: <WiCloudy size={80} color="#b0c4de" />
    };
    if (kondisi.includes('rain') || kondisi.includes('drizzle')) return {
      bg: 'linear-gradient(180deg, #1a2a4a, #0d1a2a)',
      icon: <WiRain size={300} color="rgba(100,150,255,0.2)" />,
      iconKecil: <WiRain size={80} color="#a0c4ff" />
    };
    if (kondisi.includes('thunder')) return {
      bg: 'linear-gradient(180deg, #1a1a0d, #2a1a00)',
      icon: <WiThunderstorm size={300} color="rgba(255,200,0,0.15)" />,
      iconKecil: <WiThunderstorm size={80} color="#FFD700" />
    };
    if (kondisi.includes('snow')) return {
      bg: 'linear-gradient(180deg, #a8d8ea, #ffffff)',
      icon: <WiSnow size={300} color="rgba(255,255,255,0.3)" />,
      iconKecil: <WiSnow size={80} color="#ffffff" />
    };
    if (kondisi.includes('mist') || kondisi.includes('fog')) return {
      bg: 'linear-gradient(180deg, #808080, #404040)',
      icon: <WiFog size={300} color="rgba(255,255,255,0.15)" />,
      iconKecil: <WiFog size={80} color="#cccccc" />
    };
    return {
      bg: 'linear-gradient(180deg, #0d0d0d, #1a1a2e)',
      icon: <WiDayCloudy size={200} color="rgba(255,255,255,0.15)" />,
      iconKecil: <WiDayCloudy size={80} color="#c9a84c" />
    };
  };

  const theme = getTheme();

  return (
    <div style={{
      background: theme.bg,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial',
      transition: 'background 1s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Icon background gede */}
      <div style={{
        position: 'absolute',
        top: '50px',
        right: '20px',
        opacity: 1,
        userSelect: 'none',
        pointerEvents: 'none'
      }}>
        {theme.icon}
      </div>

      <h1 style={{ color: '#fff', marginBottom: '10px', fontSize: '28px', position: 'relative', zIndex: 10 }}>
         web cuaca
      </h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', position: 'relative', zIndex: 10 }}>
        <input
  type="text"
  placeholder="Masukkan nama kota..."
  value={kota}
  onChange={(e) => setKota(e.target.value)}
  onKeyPress={(e) => e.key === 'Enter' && cariCuaca()}
  className="search-input"
/>
<button
  onClick={cariCuaca}
  className="search-button"
>
  Cari
</button>
      </div>

      {loading && <p style={{ position: 'relative', zIndex: 10 }}>Loading...</p>}
      {error && <p style={{ color: '#ff6b6b', position: 'relative', zIndex: 10 }}>{error}</p>}

      {cuaca && (
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          padding: '30px',
          borderRadius: '16px',
          textAlign: 'center',
          minWidth: '300px',
          border: '1px solid rgba(255,255,255,0.2)',
          position: 'relative',
          zIndex: 10
        }}>
          <h2 style={{ color: '#fff', marginBottom: '5px' }}>{cuaca.name}, {cuaca.sys.country}</h2>
          {theme.iconKecil}
          <h1 style={{ fontSize: '64px', margin: '0' }}>{Math.round(cuaca.main.temp)}°C</h1>
          <p style={{ fontSize: '20px', textTransform: 'capitalize', opacity: 0.9 }}>{cuaca.weather[0].description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
            <div>
              <p style={{ color: '#c9a84c', margin: '0' }}>Kelembaban</p>
              <p style={{ margin: '5px 0' }}>{cuaca.main.humidity}%</p>
            </div>
            <div>
              <p style={{ color: '#c9a84c', margin: '0' }}>Angin</p>
              <p style={{ margin: '5px 0' }}>{cuaca.wind.speed} m/s</p>
            </div>
            <div>
              <p style={{ color: '#c9a84c', margin: '0' }}>Terasa</p>
              <p style={{ margin: '5px 0' }}>{Math.round(cuaca.main.feels_like)}°C</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;