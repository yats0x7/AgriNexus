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
    // If no API key, skip API calls and return mock data immediately
    if (!API_KEY) {
        console.warn('No OpenWeatherMap API key configured. Using mock weather data.');
        return getMockWeatherData(district, state);
    }

    try {
        const location = village ? `${village}, ${district}, ${state}, India` : `${district}, ${state}, India`;

        // Get coordinates
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!Array.isArray(geoData) || geoData.length === 0) {
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
        return getMockWeatherData(district, state);
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

// Region-based weather profiles for realistic mock data
interface RegionWeather {
    tempBase: number; tempRange: number; humidity: number; wind: number;
    conditions: string[]; rainChance: number; uvIndex: number;
}

const regionProfiles: Record<string, RegionWeather> = {
    arid: { tempBase: 38, tempRange: 8, humidity: 25, wind: 18, conditions: ['Clear Sky', 'Sunny', 'Haze'], rainChance: 10, uvIndex: 9 },
    northern: { tempBase: 22, tempRange: 12, humidity: 55, wind: 10, conditions: ['Partly Cloudy', 'Sunny', 'Haze', 'Foggy'], rainChance: 30, uvIndex: 5 },
    coastal: { tempBase: 30, tempRange: 5, humidity: 80, wind: 20, conditions: ['Partly Cloudy', 'Light Rain', 'Cloudy', 'Humid'], rainChance: 60, uvIndex: 7 },
    eastern: { tempBase: 28, tempRange: 8, humidity: 75, wind: 12, conditions: ['Cloudy', 'Light Rain', 'Thunderstorm', 'Humid'], rainChance: 55, uvIndex: 6 },
    southern: { tempBase: 32, tempRange: 6, humidity: 65, wind: 14, conditions: ['Sunny', 'Partly Cloudy', 'Light Rain'], rainChance: 40, uvIndex: 8 },
    hilly: { tempBase: 15, tempRange: 10, humidity: 60, wind: 15, conditions: ['Cloudy', 'Light Rain', 'Misty', 'Clear Sky'], rainChance: 45, uvIndex: 4 },
};

const stateToRegion: Record<string, string> = {
    'rajasthan': 'arid', 'gujarat': 'arid',
    'punjab': 'northern', 'haryana': 'northern', 'uttar pradesh': 'northern', 'delhi': 'northern',
    'madhya pradesh': 'northern', 'bihar': 'eastern',
    'kerala': 'coastal', 'goa': 'coastal', 'andhra pradesh': 'coastal', 'odisha': 'coastal',
    'west bengal': 'eastern', 'assam': 'eastern', 'jharkhand': 'eastern', 'chhattisgarh': 'eastern',
    'tamil nadu': 'southern', 'karnataka': 'southern', 'telangana': 'southern', 'maharashtra': 'southern',
    'himachal pradesh': 'hilly', 'uttarakhand': 'hilly', 'sikkim': 'hilly',
    'jammu': 'hilly', 'arunachal pradesh': 'hilly', 'meghalaya': 'hilly',
    'nagaland': 'hilly', 'manipur': 'hilly', 'mizoram': 'hilly', 'tripura': 'eastern',
};

// Simple hash for deterministic but varied data per location
function locationSeed(location: string): number {
    let hash = 0;
    for (let i = 0; i < location.length; i++) {
        hash = ((hash << 5) - hash) + location.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function getMockWeatherData(district: string, state?: string): WeatherData {
    const regionKey = state ? stateToRegion[state.toLowerCase()] || 'northern' : 'northern';
    const profile = regionProfiles[regionKey];
    const seed = locationSeed(district + (state || ''));

    // Deterministic variation based on location
    const tempVariation = (seed % profile.tempRange) - profile.tempRange / 2;
    const currentTemp = Math.round(profile.tempBase + tempVariation);
    const currentCondition = profile.conditions[seed % profile.conditions.length];

    const forecastConditions = ['sunny', 'cloudy', 'rainy', 'stormy'];

    return {
        current: {
            temp: currentTemp,
            condition: currentCondition,
            humidity: Math.round(profile.humidity + (seed % 15) - 7),
            wind: Math.round(profile.wind + (seed % 8) - 4),
            visibility: Math.round(8 + (seed % 7)),
            pressure: Math.round(1005 + (seed % 20)),
            uv_index: Math.min(11, Math.round(profile.uvIndex + (seed % 3) - 1)),
            feels_like: Math.round(currentTemp + 2 + (seed % 3))
        },
        forecast: Array.from({ length: 7 }, (_, i) => {
            const daySeed = locationSeed(district + i.toString());
            return {
                day: new Date(Date.now() + i * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
                date: new Date(Date.now() + i * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                temp_max: Math.round(currentTemp + 2 + (daySeed % 5)),
                temp_min: Math.round(currentTemp - 6 - (daySeed % 4)),
                condition: forecastConditions[daySeed % forecastConditions.length],
                rain_chance: Math.round(profile.rainChance + (daySeed % 25) - 12),
                rainfall: Math.round(Math.max(0, (daySeed % 15) - 5))
            };
        }),
        location: {
            name: district,
            country: 'IN'
        }
    };
}
