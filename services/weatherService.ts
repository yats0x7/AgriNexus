// Weather service using OpenWeatherMap API
// Get your free API key from https://openweathermap.org/api
// Add it to .env.local file as NEXT_PUBLIC_OPENWEATHER_API_KEY

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
    current: {
        temp: number;
        condition: string;
        humidity: number;
        wind: number;
        visibility: number;
        pressure: number;
        uv_index: number;
        feels_like: number;
    };
    forecast: Array<{
        day: string;
        date: string;
        temp_max: number;
        temp_min: number;
        condition: string;
        rain_chance: number;
        rainfall: number;
    }>;
    location: {
        name: string;
        country: string;
    };
}

export async function getWeatherData(
    district: string,
    state: string,
    village?: string
): Promise<WeatherData> {
    try {
        const location = village ? `${village}, ${district}, ${state}, India` : `${district}, ${state}, India`;

        // Get coordinates
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData || geoData.length === 0) {
            throw new Error('Location not found');
        }

        const { lat, lon, name, country } = geoData[0];

        // Get current weather
        const currentUrl = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        const currentResponse = await fetch(currentUrl);
        const currentData = await currentResponse.json();

        // Get forecast
        const forecastUrl = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        // Process forecast data - get daily forecasts
        const dailyForecasts: any[] = [];
        const processedDates = new Set();

        forecastData.list.forEach((item: any) => {
            const date = new Date(item.dt * 1000);
            const dateStr = date.toISOString().split('T')[0];

            if (!processedDates.has(dateStr) && dailyForecasts.length < 7) {
                processedDates.add(dateStr);

                // Get all forecasts for this day to calculate min/max
                const dayForecasts = forecastData.list.filter((f: any) => {
                    const fDate = new Date(f.dt * 1000).toISOString().split('T')[0];
                    return fDate === dateStr;
                });

                const temps = dayForecasts.map((f: any) => f.main.temp);
                const temp_max = Math.round(Math.max(...temps));
                const temp_min = Math.round(Math.min(...temps));

                const rainfall = dayForecasts.reduce((sum: number, f: any) => {
                    return sum + (f.rain?.['3h'] || 0);
                }, 0);

                dailyForecasts.push({
                    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    temp_max,
                    temp_min,
                    condition: getWeatherCondition(item.weather[0].main),
                    rain_chance: Math.round((item.pop || 0) * 100),
                    rainfall: Math.round(rainfall)
                });
            }
        });

        return {
            current: {
                temp: Math.round(currentData.main.temp),
                condition: currentData.weather[0].description,
                humidity: currentData.main.humidity,
                wind: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
                visibility: Math.round(currentData.visibility / 1000), // Convert to km
                pressure: currentData.main.pressure,
                uv_index: 0, // UV index requires separate API call or subscription
                feels_like: Math.round(currentData.main.feels_like)
            },
            forecast: dailyForecasts,
            location: {
                name: name,
                country: country
            }
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Return mock data as fallback
        return getMockWeatherData(district);
    }
}

function getWeatherCondition(main: string): string {
    const conditions: Record<string, string> = {
        'Clear': 'sunny',
        'Clouds': 'cloudy',
        'Rain': 'rainy',
        'Drizzle': 'rainy',
        'Thunderstorm': 'stormy',
        'Snow': 'snowy',
        'Mist': 'cloudy',
        'Fog': 'cloudy'
    };
    return conditions[main] || 'cloudy';
}

function getMockWeatherData(location: string): WeatherData {
    return {
        current: {
            temp: 28,
            condition: 'Partly Cloudy',
            humidity: 65,
            wind: 12,
            visibility: 10,
            pressure: 1013,
            uv_index: 6,
            feels_like: 30
        },
        forecast: Array.from({ length: 7 }, (_, i) => ({
            day: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            temp_max: 30 + Math.floor(Math.random() * 5),
            temp_min: 20 + Math.floor(Math.random() * 5),
            condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
            rain_chance: Math.floor(Math.random() * 60),
            rainfall: Math.floor(Math.random() * 10)
        })),
        location: {
            name: location,
            country: 'IN'
        }
    };
}
