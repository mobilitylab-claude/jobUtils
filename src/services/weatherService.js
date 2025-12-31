const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * 날씨 상태 코드를 한글 설명으로 변환
 */
const getWeatherCondition = (id) => {
    if (id >= 200 && id < 300) return '뇌우';
    if (id >= 300 && id < 400) return '이슬비';
    if (id >= 500 && id < 600) return '비';
    if (id >= 600 && id < 700) return '눈';
    if (id >= 700 && id < 800) return '흐림'; // 안개 등
    if (id === 800) return '맑음';
    if (id > 800) return '구름';
    return '맑음';
};

/**
 * 날씨 데이터 포맷팅
 */
const formatWeatherData = (currentData, forecastData) => {
    // 현재 날씨 처리
    const current = {
        temp: Math.round(currentData.main.temp),
        condition: getWeatherCondition(currentData.weather[0].id),
        location: currentData.name,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        feelsLike: Math.round(currentData.main.feels_like),
        rainChance: 0 // 현재 API에서는 강수확률을 직접 주지 않음 (Forecast에서 가져오거나 pop 사용 필요)
    };

    // 예보 데이터 처리 (매일 12:00 기준 or 하루 평균)
    // forecastData.list는 3시간 간격. 다음 4일의 데이터를 추출해야 함.
    const dailyForecast = [];
    const processedDates = new Set();
    const today = new Date().getDate();

    for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        const dateNum = date.getDate();

        // 오늘은 제외하고, 이미 처리한 날짜 제외 (하루 1개씩)
        // 12시 근처의 데이터를 쓰거나, 첫번째 데이터를 사용
        if (dateNum !== today && !processedDates.has(dateNum)) {
            if (dailyForecast.length >= 4) break;

            // 간단하게 정오(12시) 데이터 혹은 가능한 첫 데이터를 사용
            // 여기서는 3시간 간격이므로 그냥 날짜가 바뀌면 추가하는 식으로 단순화 구현
            // 좀 더 정확하려면 12:00 데이터를 찾거나 해야 함
            if (date.getHours() >= 12 || !processedDates.has(dateNum)) {
                dailyForecast.push({
                    day: getDayName(date),
                    temp: Math.round(item.main.temp),
                    condition: getWeatherCondition(item.weather[0].id)
                });
                processedDates.add(dateNum);
            }
        }
    }

    return { current, forecast: dailyForecast };
};

const getDayName = (date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    // 오늘 기준: '내일', '모레', '글피' 등으로 할 수도 있지만 요일로 표시하는게 일반적
    // 기존 요구사항에 맞춰 '내일', '모레' 등으로 변환 로직 추가 가능하나
    // 우선 요일로 반환. 필요시 수정.

    // 간단한 상대 날짜 로직
    const today = new Date();
    const diffTime = Math.abs(date - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 정확한 날짜 차이 계산이 필요하지만(자정 기준), 여기서는 생략하고 요일 리턴
    return days[date.getDay()];
};

export const fetchWeather = async (lat, lon) => {
    if (!API_KEY) {
        throw new Error('API Key가 설정되지 않았습니다.');
    }

    try {
        // 현재 날씨
        const currentRes = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
        );
        const currentData = await currentRes.json();

        // 5일 예보
        const forecastRes = await fetch(
            `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
        );
        const forecastData = await forecastRes.json();

        if (currentData.cod !== 200 || forecastData.cod !== "200") {
            throw new Error(currentData.message || forecastData.message);
        }

        return formatWeatherData(currentData, forecastData);
    } catch (error) {
        console.error('Weather fetching error:', error);
        throw error;
    }
};
