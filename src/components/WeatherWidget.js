import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import UmbrellaIcon from '@mui/icons-material/Umbrella';

function WeatherWidget() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWeather = async (lat, lon) => {
      try {
        setLoading(true);
        // 동적 import로 순환 참조 방지 및 구조화
        const { fetchWeather } = await import('../services/weatherService');
        const data = await fetchWeather(lat, lon);
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            loadWeather(position.coords.latitude, position.coords.longitude);
          },
          (err) => {
            // 위치 권한 거부 등의 경우 기본 위치(서울) 사용
            console.warn('위치 정보를 가져올 수 없어 기본 위치(서울)로 설정합니다.', err);
            loadWeather(37.5665, 126.9780); // 서울 시청 좌표
          }
        );
      } else {
        loadWeather(37.5665, 126.9780);
      }
    };

    getLocation();
  }, []);

  if (loading) return <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography>날씨 정보를 불러오는 중...</Typography></Card>;
  if (error) return <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="error">{error}</Typography></Card>;
  if (!weatherData) return null;

  // Animations
  const sunAnimation = {
    animation: 'spin 10s linear infinite',
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  };

  const cloudAnimation = {
    animation: 'float 3s ease-in-out infinite',
    '@keyframes float': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-5px)' },
    },
  };

  const rainAnimation = {
    animation: 'shake 2s ease-in-out infinite',
    '@keyframes shake': {
      '0%, 100%': { transform: 'rotate(-5deg)' },
      '50%': { transform: 'rotate(5deg)' },
    },
  };

  const getWeatherIcon = (condition, size = 80) => {
    switch (condition) {
      case '맑음':
        return <WbSunnyIcon sx={{ fontSize: size, color: '#fdd835', ...sunAnimation }} />;
      case '구름': // Added case
      case '흐림':
        return <CloudIcon sx={{ fontSize: size, color: '#90a4ae', ...cloudAnimation }} />;
      case '눈':
        return <AcUnitIcon sx={{ fontSize: size, color: '#4fc3f7', ...rainAnimation }} />;
      case '비':
      case '이슬비': // Added case
        return <WaterDropIcon sx={{ fontSize: size, color: '#4fc3f7', ...rainAnimation }} />;
      case '뇌우': // Added case
        return <ThunderstormIcon sx={{ fontSize: size, color: '#616161', ...rainAnimation }} />;
      default:
        return <WbSunnyIcon sx={{ fontSize: size, color: '#fdd835' }} />;
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
          {/* Today's Weather - Prominent */}
          <Grid item xs={12} sm={5} sx={{ textAlign: 'center', borderRight: { sm: 1 }, borderColor: 'divider' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {weatherData.current.location} (오늘)
            </Typography>
            <Box sx={{ my: 1, display: 'flex', justifyContent: 'center' }}>
              {getWeatherIcon(weatherData.current.condition, 100)}
            </Box>
            <Typography variant="h2" component="div" fontWeight="bold">
              {weatherData.current.temp}°
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              {weatherData.current.condition}
            </Typography>

            {/* Detailed Info */}
            <Grid container spacing={1} justifyContent="center" sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <WaterDropIcon color="primary" fontSize="small" />
                  <Typography variant="body2">{weatherData.current.humidity}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <AirIcon color="action" fontSize="small" />
                  <Typography variant="body2">{weatherData.current.windSpeed}m/s</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <ThermostatIcon color="error" fontSize="small" />
                  <Typography variant="body2">체감 {weatherData.current.feelsLike}°</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <UmbrellaIcon color="info" fontSize="small" />
                  <Typography variant="body2">{weatherData.current.rainChance}%</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid >

          {/* 4-Day Forecast */}
          < Grid item xs={12} sm={7} >
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, px: 1 }}>
              주간 예보
            </Typography>
            <Grid container spacing={1}>
              {weatherData.forecast.map((day, index) => (
                <Grid item xs={3} key={index} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {day.day}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {getWeatherIcon(day.condition, 32)}
                  </Box>
                  <Typography variant="body1" fontWeight="bold">
                    {day.temp}°
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid >
        </Grid >
      </CardContent >
    </Card >
  );
}

export default WeatherWidget;