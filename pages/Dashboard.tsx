
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import LocationSelector from "../components/shared/LocationSelector";
import { districtsByState } from "@/data/districts";
import { getWeatherData, type WeatherData } from "@/services/weatherService";
import { WeatherAlert as WeatherAlertEntity, type WeatherAlertInterface } from "@/entities/WeatherAlert";
import { MandiPrice } from "@/entities/MandiPrice";
import {
  Stethoscope,
  TrendingUp,
  Cloud,
  Users,
  FileText,
  Sprout,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  MapPinned,
  Loader2,
  Search,
  CloudRain
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Detect current farming season based on month
function getCurrentSeason(): { name: string; year: number } {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const year = now.getFullYear();
  if (month >= 5 && month <= 9) return { name: "Kharif", year };
  if (month >= 10 || month <= 1) return { name: "Rabi", year: month >= 10 ? year : year - 1 };
  return { name: "Zaid", year };
}

// Get region-specific crops based on state
function getRegionCrops(state: string): string[] {
  const stateCrops: Record<string, string[]> = {
    "Punjab": ["Wheat", "Rice", "Cotton", "Maize"],
    "Haryana": ["Wheat", "Rice", "Mustard", "Bajra"],
    "Maharashtra": ["Soybean", "Cotton", "Onion", "Sugarcane"],
    "Uttar Pradesh": ["Wheat", "Rice", "Sugarcane", "Potato"],
    "Rajasthan": ["Mustard", "Cumin", "Bajra", "Wheat"],
    "Gujarat": ["Groundnut", "Cotton", "Cumin", "Castor"],
    "Karnataka": ["Ragi", "Rice", "Maize", "Sugarcane"],
    "Tamil Nadu": ["Rice", "Groundnut", "Coconut", "Banana"],
    "Madhya Pradesh": ["Soybean", "Wheat", "Gram", "Lentil"],
    "West Bengal": ["Rice", "Jute", "Potato", "Vegetables"],
    "Bihar": ["Rice", "Wheat", "Maize", "Litchi"],
    "Andhra Pradesh": ["Rice", "Chilli", "Cotton", "Tobacco"],
    "Telangana": ["Rice", "Cotton", "Turmeric", "Maize"],
    "Kerala": ["Coconut", "Rubber", "Spices", "Rice"],
    "Odisha": ["Rice", "Groundnut", "Sesame", "Vegetables"],
  };
  return stateCrops[state] || ["Wheat", "Rice", "Vegetables"];
}

export default function Dashboard() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlertInterface[]>([]);
  const [topPrices, setTopPrices] = useState<{ crop: string; price: number; trend: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);

  const season = getCurrentSeason();
  const regionCrops = getRegionCrops(selectedState);

  // Geolocation auto-detect on mount
  useEffect(() => {
    detectUserLocation();
  }, []);

  // Auto-fetch data when location is set via geolocation
  useEffect(() => {
    if (selectedState && selectedDistrict && !locationDetected) {
      setLocationDetected(true);
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, selectedDistrict]);

  const detectUserLocation = async () => {
    if (!navigator.geolocation) {
      setSelectedState("Punjab");
      setSelectedDistrict("Ludhiana");
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await response.json();

          if (data?.address) {
            const detectedState = data.address.state || "";
            const detectedDistrict = data.address.state_district || data.address.county || data.address.city || "";

            const matchedState = Object.keys(districtsByState).find(
              (s) => s.toLowerCase() === detectedState.toLowerCase()
            );

            if (matchedState) {
              setSelectedState(matchedState);
              const districts = districtsByState[matchedState];
              const matchedDistrict = districts.find(
                (d) =>
                  detectedDistrict.toLowerCase().includes(d.toLowerCase()) ||
                  d.toLowerCase().includes(detectedDistrict.toLowerCase())
              );
              setSelectedDistrict(matchedDistrict || districts[0]);
            } else {
              setSelectedState("Punjab");
              setSelectedDistrict("Ludhiana");
            }
          }
        } catch {
          setSelectedState("Punjab");
          setSelectedDistrict("Ludhiana");
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setSelectedState("Punjab");
        setSelectedDistrict("Ludhiana");
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const fetchDashboardData = async () => {
    if (!selectedState || !selectedDistrict) return;
    setIsLoading(true);
    try {
      // Fetch weather
      const weather = await getWeatherData(selectedDistrict, selectedState);
      setWeatherData(weather);

      // Fetch alerts
      const weatherAlerts = await WeatherAlertEntity.filter({ state: selectedState });
      setAlerts(weatherAlerts);

      // Fetch top mandi prices for this state
      const prices = await MandiPrice.filter({ state: selectedState });
      setTopPrices(
        prices.slice(0, 3).map((p) => ({
          crop: p.crop_name,
          price: p.modal_price,
          trend: p.modal_price > p.min_price + (p.max_price - p.min_price) / 2 ? "up" : "stable"
        }))
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { title: "AI Crop Doctor", description: "Diagnose crop diseases instantly", icon: Stethoscope, url: "/AiDoctor", color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50", textColor: "text-blue-700" },
    { title: "Live Mandi Prices", description: "Check today's market rates", icon: TrendingUp, url: "/MandiPrices", color: "from-green-500 to-green-600", bgColor: "bg-green-50", textColor: "text-green-700" },
    { title: "Weather Forecast", description: "7-day weather prediction", icon: Cloud, url: "/Weather", color: "from-sky-500 to-sky-600", bgColor: "bg-sky-50", textColor: "text-sky-700" },
    { title: "Expert Consultation", description: "Connect with agricultural experts", icon: Users, url: "/ExpertAdvice", color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50", textColor: "text-purple-700" },
    { title: "Government Schemes", description: "Access subsidies and loans", icon: FileText, url: "/GovernmentSchemes", color: "from-orange-500 to-orange-600", bgColor: "bg-orange-50", textColor: "text-orange-700" },
    { title: "Seeds Marketplace", description: "Buy certified quality seeds", icon: Sprout, url: "/SeedsMarketplace", color: "from-lime-500 to-lime-600", bgColor: "bg-lime-50", textColor: "text-lime-700" },
  ];

  const getWeatherIcon = (condition: string) => {
    if (!condition) return <Cloud className="w-10 h-10 text-white/80" />;
    const c = condition.toLowerCase();
    if (c.includes("sun") || c.includes("clear")) return <Sun className="w-10 h-10 text-yellow-300" />;
    if (c.includes("rain")) return <CloudRain className="w-10 h-10 text-blue-200" />;
    if (c.includes("cloud")) return <Cloud className="w-10 h-10 text-white/80" />;
    return <Thermometer className="w-10 h-10 text-white/80" />;
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Welcome to <span className="text-green-600">AgriNexus</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your smart farming companion powered by AI and real-time data
          </p>
        </div>

        {/* Location Selector */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div className="flex-1">
            <LocationSelector
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              onClick={detectUserLocation}
              variant="outline"
              disabled={detectingLocation}
              className="gap-2"
              size="sm"
            >
              {detectingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPinned className="w-4 h-4" />}
              {detectingLocation ? "Detecting..." : "My Location"}
            </Button>
            <Button
              onClick={fetchDashboardData}
              disabled={isLoading || !selectedState || !selectedDistrict}
              className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              size="sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {isLoading ? "Loading..." : "Update"}
            </Button>
          </div>
        </div>

        {/* Weather Widget - Dynamic */}
        <Card className="bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-xl">
          <CardContent className="p-6">
            {weatherData ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 flex items-center gap-4">
                  {getWeatherIcon(weatherData.current.condition)}
                  <div>
                    <h3 className="text-sm font-medium text-sky-200 mb-1 flex items-center gap-1">
                      <Cloud className="w-4 h-4" />
                      Weather in {selectedDistrict}, {selectedState}
                    </h3>
                    <p className="text-4xl font-bold">{weatherData.current.temp}°C</p>
                    <p className="text-sky-100">{weatherData.current.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Droplets className="w-8 h-8 text-sky-200" />
                  <div>
                    <p className="text-sm text-sky-200">Humidity</p>
                    <p className="text-xl font-bold">{weatherData.current.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wind className="w-8 h-8 text-sky-200" />
                  <div>
                    <p className="text-sm text-sky-200">Wind</p>
                    <p className="text-xl font-bold">{weatherData.current.wind} km/h</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-4 gap-2 text-sky-100">
                {isLoading || detectingLocation ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Loading weather data...</>
                ) : (
                  <><Cloud className="w-5 h-5" /> Select a location and click Update to see weather</>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Farm Stats - Dynamic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Top Crops</p>
                  <p className="text-lg font-bold text-gray-900">{regionCrops.slice(0, 2).join(", ")}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedState || "India"}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Sprout className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Season</p>
                  <p className="text-2xl font-bold text-gray-900">{season.name} {season.year}</p>
                </div>
                <div className="p-3 rounded-full bg-amber-100">
                  <Sun className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Top Mandi Price</p>
                  {topPrices.length > 0 ? (
                    <>
                      <p className="text-2xl font-bold text-gray-900">₹{topPrices[0].price}/q</p>
                      <p className="text-xs text-gray-500 mt-1">{topPrices[0].crop} • {topPrices[0].trend === "up" ? "↑ Rising" : "→ Stable"}</p>
                    </>
                  ) : (
                    <p className="text-lg font-bold text-gray-400">—</p>
                  )}
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts - Dynamic from WeatherAlert entity */}
        {alerts.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Alerts for {selectedState}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-4 p-4 rounded-lg transition-colors duration-200 ${alert.severity === "extreme" ? "bg-red-50 hover:bg-red-100" :
                        alert.severity === "high" ? "bg-amber-50 hover:bg-amber-100" :
                          alert.severity === "moderate" ? "bg-yellow-50 hover:bg-yellow-100" :
                            "bg-blue-50 hover:bg-blue-100"
                      }`}
                  >
                    <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${alert.severity === "extreme" ? "text-red-500" :
                        alert.severity === "high" ? "text-amber-500" :
                          "text-blue-500"
                      }`} />
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold">{alert.type}</p>
                      <p className="text-gray-700 text-sm mt-1">{alert.message}</p>
                      <Badge variant="outline" className="mt-2">{alert.severity}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Market Snapshot */}
        {topPrices.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Market Snapshot — {selectedState}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topPrices.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{item.crop}</p>
                      <p className="text-sm text-gray-500">{item.trend === "up" ? "↑ Rising" : "→ Stable"}</p>
                    </div>
                    <p className="text-xl font-bold text-green-600">₹{item.price.toLocaleString()}/q</p>
                  </div>
                ))}
              </div>
              <Link href="/MandiPrices" className="flex items-center gap-1 text-green-600 font-medium mt-4 hover:gap-2 transition-all">
                View all prices <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.url}>
                <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${action.color}`} />
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className={`w-6 h-6 ${action.textColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-gray-600 mb-4">{action.description}</p>
                    <div className="flex items-center text-green-600 font-medium group-hover:gap-3 transition-all duration-300">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
