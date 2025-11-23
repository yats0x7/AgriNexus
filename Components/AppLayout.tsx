import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
    Home,
    Stethoscope,
    TrendingUp,
    Cloud,
    Users,
    FileText,
    Sprout,
    FlaskConical,
    MapPin,
    Calendar,
    Brain,
    UserCheck
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
    {
        title: "Dashboard",
        url: "/Dashboard",
        icon: Home,
        color: "text-emerald-600"
    },
    {
        title: "AI Doctor",
        url: "/AiDoctor",
        icon: Stethoscope,
        color: "text-blue-600"
    },
    {
        title: "Mandi Prices",
        url: "/MandiPrices",
        icon: TrendingUp,
        color: "text-green-600"
    },
    {
        title: "Weather",
        url: "/Weather",
        icon: Cloud,
        color: "text-sky-600"
    },
    {
        title: "Expert Advice",
        url: "/ExpertAdvice",
        icon: Users,
        color: "text-purple-600"
    },
    {
        title: "Field Visit",
        url: "/FieldVisit",
        icon: UserCheck,
        color: "text-teal-600"
    },
    {
        title: "Government Schemes",
        url: "/GovernmentSchemes",
        icon: FileText,
        color: "text-orange-600"
    },
    {
        title: "Seed Recommendations",
        url: "/SeedsRecommendations",
        icon: Brain,
        color: "text-indigo-600"
    },
    {
        title: "Fertilizer Guide",
        url: "/FertilizerGuide",
        icon: FlaskConical,
        color: "text-amber-600"
    },
    {
        title: "Crop Calendar",
        url: "/CropCalendar",
        icon: Calendar,
        color: "text-pink-600"
    }
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    React.useEffect(() => {
        // Load Vapi widget script
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js';
        script.async = true;
        script.type = 'text/javascript';
        document.body.appendChild(script);

        return () => {
            // Cleanup script on unmount
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
                <style jsx global>{`
          :root {
            --agri-primary: #16a34a;
            --agri-secondary: #059669;
            --agri-accent: #eab308;
            --agri-earth: #a3a3a3;
            --agri-sky: #0ea5e9;
          }
        `}</style>

                <Sidebar className="border-r border-green-200/50 bg-white/80 backdrop-blur-sm" collapsible="none">
                    <SidebarHeader className="border-b border-green-200/50 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Sprout className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">AgriNexus</h2>
                                <p className="text-sm text-gray-600">Smart Farming Platform</p>
                            </div>
                        </div>
                    </SidebarHeader>

                    <SidebarContent className="p-4">
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2 mb-2">
                                Farm Management
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu className="space-y-1">
                                    {navigationItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                className={`group hover:bg-green-50 hover:text-green-700 transition-all duration-200 rounded-xl px-4 py-3 ${router.pathname === item.url
                                                    ? 'bg-green-50 text-green-700 shadow-sm border border-green-200'
                                                    : 'hover:shadow-sm'
                                                    }`}
                                            >
                                                <Link href={item.url} className="flex items-center gap-3">
                                                    <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
                                                    <span className="font-medium text-sm">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        <SidebarGroup className="mt-8">
                            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2 mb-2">
                                Quick Stats
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <div className="px-4 py-3 space-y-3">
                                    <div className="flex items-center justify-between text-sm bg-emerald-50 rounded-lg p-3">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-emerald-500" />
                                            Active Fields
                                        </span>
                                        <span className="font-bold text-emerald-600">12</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm bg-blue-50 rounded-lg p-3">
                                        <span className="text-gray-600">Weather Alert</span>
                                        <span className="font-bold text-blue-600">Rain Expected</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm bg-amber-50 rounded-lg p-3">
                                        <span className="text-gray-600">Best Price Today</span>
                                        <span className="font-bold text-amber-600">₹2,450/Q</span>
                                    </div>
                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter className="border-t border-green-200/50 p-4">
                        <div className="flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">F</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">Farmer</p>
                                <p className="text-xs text-gray-600 truncate">Growing Success Together</p>
                            </div>
                        </div>
                    </SidebarFooter>
                </Sidebar>

                <main className="flex-1 flex flex-col">
                    <header className="bg-white/80 backdrop-blur-sm border-b border-green-200/50 px-6 py-4 md:hidden">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="hover:bg-green-100 p-2 rounded-xl transition-colors duration-200" />
                            <h1 className="text-xl font-bold text-gray-900">AgriNexus</h1>
                        </div>
                    </header>

                    <div className="flex-1 overflow-auto">
                        {children}
                    </div>
                </main>

                {/* Vapi Voice Widget - Static on all pages */}
                <div
                    dangerouslySetInnerHTML={{
                        __html: `
              <vapi-widget
                public-key="7ec3dfc5-beed-416c-9186-c66105014981"
                assistant-id="b0983a39-edb1-4133-bbaa-cc30ea6df304"
                mode="voice"
                theme="dark"
                base-bg-color="#000000"
                accent-color="#14B8A6"
                cta-button-color="#000000"
                cta-button-text-color="#ffffff"
                border-radius="large"
                size="full"
                position="bottom-right"
                title="TALK WITH AI"
                start-button-text="Start"
                end-button-text="End Call"
                chat-first-message="Hey, How can I help you today?"
                chat-placeholder="Type your message..."
                voice-show-transcript="true"
                consent-required="true"
                consent-title="Terms and conditions"
                consent-content="By clicking 'Agree,' and each time I interact with this AI agent, I consent to the recording, storage, and sharing of my communications with third-party service providers, and as otherwise described in our Terms of Service."
                consent-storage-key="vapi_widget_consent"
              ></vapi-widget>
            `
                    }}
                />
            </div>
        </SidebarProvider>
    );
}
