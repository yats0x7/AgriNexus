import React, { useState, useEffect, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LocationSelector from '../components/shared/LocationSelector';
import { WeatherAlert as WeatherAlertEntity } from '@/entities/WeatherAlert';
import {
    Cloud, Sun, CloudRain, Wind, Droplets, Thermometer,
    AlertTriangle, CloudLightning, Eye, Gauge, Brain, MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { InvokeLLM } from '@/integrations/Core';
import { getWeatherData, type WeatherData } from '@/services/weatherService';

// Types for weather data
interface WeatherCondition {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
    visibility: number;
    pressure: number;
    uv_index: number;
}

interface ForecastDay {
    day: string;
    date: string;
    temp_max: number;
    temp_min: number;
    condition: string;
    rain_chance: number;
    rainfall: number;
}

interface WeatherAlert {
    type: string;
    message: string;
    severity: 'low' | 'moderate' | 'high' | 'extreme';
    icon?: ReactNode;
    advisory: string[];
}

// Mock weather data simulating Meghdoot + mKisan API response
const generateWeatherData = (location: string): WeatherData => ({
    current: {
        temp: Math.round(25 + Math.random() * 15),
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        humidity: Math.round(40 + Math.random() * 40),
        wind: Math.round(5 + Math.random() * 15),
        visibility: Math.round(8 + Math.random() * 7),
        pressure: Math.round(1000 + Math.random() * 50),
        uv_index: Math.round(3 + Math.random() * 8),
        feels_like: Math.round(27 + Math.random() * 15)
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
        day: format(new Date(Date.now() + i * 24 * 60 * 60 * 1000), 'EEE'),
        date: format(new Date(Date.now() + i * 24 * 60 * 60 * 1000), 'MMM dd'),
        temp_max: Math.round(28 + Math.random() * 10),
        temp_min: Math.round(18 + Math.random() * 8),
        condition: ['sunny', 'cloudy', 'rainy', 'stormy'][Math.floor(Math.random() * 4)],
        rain_chance: Math.round(Math.random() * 100),
        rainfall: Math.round(Math.random() * 25)
    })),
    location: {
        name: location,
        country: 'IN'
    }
});

const weatherIcons: Record<string, React.ReactElement> = {
    sunny: <Sun className="w-8 h-8 text-yellow-400" />,
    cloudy: <Cloud className="w-8 h-8 text-gray-400" />,
    rainy: <CloudRain className="w-8 h-8 text-blue-400" />,
    stormy: <CloudLightning className="w-8 h-8 text-yellow-500" />
};

export default function Weather() {
    const [selectedState, setSelectedState] = useState<string>("Punjab");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("Ludhiana");
    const [village, setVillage] = useState<string>("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [aiAdvice, setAiAdvice] = useState<{
        field_operations: string;
        crop_protection: string;
        safety_measures: string;
        best_farming_days: string;
        overall_summary: string;
    } | null>(null);
    const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeatherData = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch real weather data
            const weatherData = await getWeatherData(selectedDistrict, selectedState, village);
            setWeather(weatherData);

            // Fetch weather alerts from database
            const weatherAlerts = await WeatherAlertEntity.filter({
                location: `${selectedDistrict}, ${selectedState}`
            });
            setAlerts(weatherAlerts);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setError("Unable to fetch weather data. Please try again.");
            // Fall back to mock data
            setWeather(generateWeatherData(selectedDistrict));
        } finally {
            setIsLoading(false);
        }
    }, [selectedState, selectedDistrict, village]);

    const generateWeatherAdvice = React.useCallback(async () => {
        if (!weather) return;

        setLoadingAdvice(true);
        try {
            const location = village ? `${village}, ${selectedDistrict}` : selectedDistrict;

            const prompt = `
                You are an agricultural advisor helping farmers in ${location}, ${selectedState}. 
                Based on this weather forecast data, provide simple farming advice in conversational tone:
                
                Current Weather: ${JSON.stringify(weather.current)}
                7-day Forecast: ${JSON.stringify(weather.forecast)}
                
                Provide practical advice for:
                1. Field operations (sowing, harvesting, irrigation)
                2. Crop protection measures  
                3. Equipment/livestock safety
                4. Best days for farming activities
                
                Write as if you're talking directly to the farmer in simple, actionable language.
            `;

            const responseStr = await InvokeLLM({
                prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        field_operations: { type: "string" },
                        crop_protection: { type: "string" },
                        safety_measures: { type: "string" },
                        best_farming_days: { type: "string" },
                        overall_summary: { type: "string" }
                    }
                }
            });

            const advice = JSON.parse(responseStr);
            setAiAdvice(advice);
        } catch (error) {
            console.error("Error generating weather advice:", error);
        }
        setLoadingAdvice(false);
    }, [weather, village, selectedDistrict, selectedState]);

    useEffect(() => {
        fetchWeatherData();
    }, [fetchWeatherData]);

    useEffect(() => {
        if (weather) {
            generateWeatherAdvice();
        }
    }, [generateWeatherAdvice, weather]);

    const getCurrentIcon = (condition: string): React.ReactElement => {
        if (condition.includes('Sun')) return <Sun className="w-16 h-16 text-white" />;
        if (condition.includes('Rain')) return <CloudRain className="w-16 h-16 text-white" />;
        if (condition.includes('Cloud')) return <Cloud className="w-16 h-16 text-white" />;
        return <Sun className="w-16 h-16 text-white" />;
    };

    const getAlertColor = (severity: 'low' | 'moderate' | 'high' | 'extreme'): string => {
        return {
            low: 'bg-blue-50 border-blue-200 text-blue-800',
            moderate: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            high: 'bg-orange-50 border-orange-200 text-orange-800',
            extreme: 'bg-red-50 border-red-200 text-red-800'
        }[severity] || 'bg-gray-50 border-gray-200 text-gray-800';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen p-6 bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <Cloud className="w-16 h-16 animate-pulse text-blue-500 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">Fetching weather data from Meghdoot API...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                        <Cloud className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">Weather Forecast</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Accurate village-level weather from Meghdoot & mKisan APIs with AI farming advice
                    </p>
                </div>

                {/* Location Input */}
                <LocationSelector
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={setSelectedDistrict}
                />

                {/* Village Input */}
                <Card className="shadow-lg">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <Label htmlFor="village">Village (Optional for more precise forecast)</Label>
                                <Input
                                    id="village"
                                    value={village}
                                    onChange={(e) => setVillage(e.target.value)}
                                    placeholder="Enter your village name"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {weather && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Current Weather */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* AI Weather Advice */}
                            {aiAdvice && (
                                <Card className="shadow-lg border-l-4 border-l-sky-500">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-sky-700">
                                            <Brain className="w-5 h-5" />
                                            AI Weather Advisor - {village || selectedDistrict}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Alert className="bg-sky-50 border-sky-200">
                                            <MessageCircle className="h-4 w-4 text-sky-600" />
                                            <AlertDescription className="text-sky-800 font-medium">
                                                {aiAdvice.overall_summary}
                                            </AlertDescription>
                                        </Alert>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                                <h4 className="font-semibold text-green-800 mb-2">🚜 Field Operations</h4>
                                                <p className="text-green-700 text-sm">{aiAdvice.field_operations}</p>
                                            </div>
                                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                                <h4 className="font-semibold text-amber-800 mb-2">🛡️ Crop Protection</h4>
                                                <p className="text-amber-700 text-sm">{aiAdvice.crop_protection}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                                <h4 className="font-semibold text-red-800 mb-2">⚠️ Safety Measures</h4>
                                                <p className="text-red-700 text-sm">{aiAdvice.safety_measures}</p>
                                            </div>
                                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                                <h4 className="font-semibold text-purple-800 mb-2">📅 Best Farming Days</h4>
                                                <p className="text-purple-700 text-sm">{aiAdvice.best_farming_days}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <Card className="shadow-lg bg-gradient-to-br from-blue-500 to-sky-600 text-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Thermometer className="w-5 h-5" />
                                        Current Weather in {village || selectedDistrict}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        {getCurrentIcon(weather.current.condition)}
                                        <div>
                                            <p className="text-5xl font-bold">{weather.current.temp}°C</p>
                                            <p className="text-xl text-sky-100">{weather.current.condition}</p>
                                            <p className="text-sm text-sky-200 mt-2">
                                                Feels like {weather.current.temp + 2}°C
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <Droplets className="w-6 h-6 text-sky-200 mb-2" />
                                            <p className="font-bold text-lg">{weather.current.humidity}%</p>
                                            <p className="text-xs text-sky-200">Humidity</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Wind className="w-6 h-6 text-sky-200 mb-2" />
                                            <p className="font-bold text-lg">{weather.current.wind}</p>
                                            <p className="text-xs text-sky-200">km/h</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Eye className="w-6 h-6 text-sky-200 mb-2" />
                                            <p className="font-bold text-lg">{weather.current.visibility}</p>
                                            <p className="text-xs text-sky-200">km</p>
                                        </div>
                                    </div>
                                </CardContent>

                                {/* Additional Weather Info */}
                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-2 gap-4 text-center bg-white/10 rounded-lg p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Gauge className="w-4 h-4" />
                                            <span className="text-sm">Pressure: {weather.current.pressure} hPa</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <Sun className="w-4 h-4" />
                                            <span className="text-sm">UV Index: {weather.current.uv_index}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 7-Day Forecast */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle>7-Day Forecast</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {weather.forecast.map((day, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="text-center min-w-[60px]">
                                                    <p className="font-bold text-gray-800">{day.day}</p>
                                                    <p className="text-xs text-gray-500">{day.date}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {weatherIcons[day.condition]}
                                                    <div>
                                                        <p className="text-sm text-gray-600 capitalize">{day.condition}</p>
                                                        <p className="text-xs text-blue-600">{day.rain_chance}% rain</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-800">
                                                    {day.temp_max}°/{day.temp_min}°
                                                </p>
                                                {day.rainfall > 0 && (
                                                    <p className="text-xs text-blue-600">{day.rainfall}mm rain</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Alerts and Advisory */}
                        <div className="space-y-6">
                            {/* Weather Alerts */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                        Weather Alerts
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {alerts.map((alert, index) => (
                                        <Alert key={index} className={getAlertColor(alert.severity)}>
                                            <div className="flex items-start gap-2">
                                                {alert.icon || <AlertTriangle className="h-4 w-4" />}
                                                <div>
                                                    <h4 className="font-semibold">{alert.type}</h4>
                                                    <AlertDescription className="mt-1">
                                                        {alert.message}
                                                    </AlertDescription>
                                                    <div className="mt-3">
                                                        <p className="text-sm font-medium mb-1">Agricultural Advisory:</p>
                                                        <ul className="text-xs space-y-1">
                                                            {(alert.advisory || []).map((advice: string, i: number) => (
                                                                <li key={i}>• {advice}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </Alert>
                                    ))}
                                    {alerts.length === 0 && (
                                        <Alert>
                                            <div className="flex items-start gap-2">
                                                <AlertTriangle className="h-4 w-4" />
                                                <AlertDescription>No active weather alerts for this location.</AlertDescription>
                                            </div>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Farming Tips */}
                            <Card className="shadow-lg bg-green-50">
                                <CardHeader>
                                    <CardTitle className="text-green-700">Today's Farming Tips</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm text-green-800">
                                        <div className="flex items-start gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                            <p>Good day for field preparation with moderate humidity</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                            <p>Consider irrigation if no rain expected in next 48 hours</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                            <p>Monitor crops for pest activity due to humidity levels</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}