import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, HelpCircle, MessageSquare, Brain, Loader2, Search, BookOpen, Send } from 'lucide-react';
import { ExpertAdvice, ExpertAdviceInterface } from '@/entities/ExpertAdvice';
import { FarmerQuery, FarmerQueryInterface } from '@/entities/FarmerQuery';
import { InvokeLLM } from '@/integrations/Core';

interface AdviceCardProps {
    advice: ExpertAdviceInterface;
    onExplainClick: (advice: ExpertAdviceInterface) => void;
}

const AdviceCard = ({ advice, onExplainClick }: AdviceCardProps) => (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
            <div className="flex justify-between items-start">
                <CardTitle className="text-lg leading-tight pr-2">{advice.title}</CardTitle>
                <Badge variant="outline">{advice.category}</Badge>
            </div>
            <p className="text-xs text-gray-500 pt-2">
                Source: {advice.source} | Published on: {new Date(advice.publish_date).toLocaleDateString()}
            </p>
        </CardHeader>
        <CardContent>
            <p className="text-gray-700 text-sm line-clamp-3 mb-4">{advice.content}</p>
            <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                    {advice.crop_relevance.slice(0, 3).map(crop => (
                        <Badge key={crop} variant="secondary">{crop}</Badge>
                    ))}
                </div>
                <Button onClick={() => onExplainClick(advice)} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Brain className="w-4 h-4 mr-2" />
                    Explain Simply
                </Button>
            </div>
        </CardContent>
    </Card>
);

interface AskQueryFormProps {
    onQuerySubmit: (formData: any) => Promise<void>;
}

const AskQueryForm = ({ onQuerySubmit }: AskQueryFormProps) => {
    const [formData, setFormData] = useState({
        farmer_name: '',
        location: '',
        crop_type: '',
        query_text: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onQuerySubmit(formData);
        setIsSubmitting(false);
        setFormData({ farmer_name: '', location: '', crop_type: '', query_text: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Your Name" value={formData.farmer_name} onChange={e => setFormData({ ...formData, farmer_name: e.target.value })} required />
                <Input placeholder="Location (e.g., Pune, Maharashtra)" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
            </div>
            <Input placeholder="Crop Type (e.g., Rice)" value={formData.crop_type} onChange={e => setFormData({ ...formData, crop_type: e.target.value })} />
            <Textarea placeholder="Enter your question here..." value={formData.query_text} onChange={e => setFormData({ ...formData, query_text: e.target.value })} required className="h-32" />
            <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-lg py-6">
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" />}
                Submit Query
            </Button>
        </form>
    );
};

export default function ExpertAdvicePage() {
    const [adviceList, setAdviceList] = useState<ExpertAdviceInterface[]>([]);
    const [queries, setQueries] = useState<FarmerQueryInterface[]>([]);
    const [filteredAdvice, setFilteredAdvice] = useState<ExpertAdviceInterface[]>([]);
    const [selectedAdvice, setSelectedAdvice] = useState<ExpertAdviceInterface | null>(null);
    const [aiExplanation, setAiExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExplaining, setIsExplaining] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const categories = ["All", "Pest Control", "Irrigation", "Soil Health", "Fertilizers", "Harvesting", "General"];

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [advices, userQueries] = await Promise.all([
                ExpertAdvice.list(),
                FarmerQuery.list('-created_date', 10)
            ]);
            setAdviceList(advices);
            setFilteredAdvice(advices);
            setQueries(userQueries);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        let result = adviceList;
        if (categoryFilter !== 'All') {
            result = result.filter(a => a.category === categoryFilter);
        }
        if (searchTerm) {
            result = result.filter(a =>
                a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredAdvice(result);
    }, [searchTerm, categoryFilter, adviceList]);

    const handleExplainClick = async (advice: ExpertAdviceInterface) => {
        setSelectedAdvice(advice);
        setIsExplaining(true);
        setAiExplanation('');
        try {
            const prompt = `You are an agriculture expert. Explain the following advice to a farmer in simple, conversational language. Use analogies if possible. Keep it short and actionable.
            
            Official Advice: "${advice.title}: ${advice.content}"
            
            Simplified Explanation:`;

            const explanation = await InvokeLLM({ prompt });
            setAiExplanation(explanation);
        } catch (error) {
            console.error("Error getting AI explanation:", error);
            setAiExplanation('Could not generate explanation at this time.');
        }
        setIsExplaining(false);
    };

    const handleQuerySubmit = async (formData: any) => {
        try {
            await FarmerQuery.create(formData);
            fetchData(); // Refresh query list
            alert('Your query has been submitted successfully!');
        } catch (error) {
            console.error("Error submitting query:", error);
            alert('There was an error submitting your query. Please try again.');
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">Expert Advice & Helpdesk</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Access verified knowledge from agricultural experts and get your questions answered.
                    </p>
                </div>

                <Tabs defaultValue="advisories" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="advisories" className="py-3 text-base">
                            <BookOpen className="w-5 h-5 mr-2" /> Expert Advisories
                        </TabsTrigger>
                        <TabsTrigger value="ask" className="py-3 text-base">
                            <HelpCircle className="w-5 h-5 mr-2" /> Ask a Question
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="advisories" className="mt-6">
                        <Card className="shadow-lg">
                            <CardContent className="pt-6">
                                <div className="flex flex-col md:flex-row gap-4 mb-6">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <Input placeholder="Search advisories..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                                    </div>
                                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                        <SelectTrigger className="w-full md:w-[180px]">
                                            <SelectValue placeholder="Filter by category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {isLoading ? (
                                    <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" /></div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {filteredAdvice.map(advice => <AdviceCard key={advice.id} advice={advice} onExplainClick={handleExplainClick} />)}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="ask" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="shadow-lg">
                                <CardHeader><CardTitle>Submit Your Query</CardTitle></CardHeader>
                                <CardContent>
                                    <AskQueryForm onQuerySubmit={handleQuerySubmit} />
                                </CardContent>
                            </Card>
                            <Card className="shadow-lg">
                                <CardHeader><CardTitle>Recent Queries</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {queries.map(q => (
                                        <div key={q.id} className="p-3 bg-gray-50 rounded-lg">
                                            <p className="font-semibold text-gray-800 text-sm truncate">{q.query_text}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-xs text-gray-500">{q.farmer_name} from {q.location}</p>
                                                <Badge variant={q.status === 'answered' ? 'success' : 'outline'}>{q.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {selectedAdvice && (
                    <Card className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAdvice(null)}>
                        <CardContent className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 space-y-6 relative" onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setSelectedAdvice(null)}>X</Button>
                            <CardTitle>{selectedAdvice.title}</CardTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5 text-gray-600" /> Official Advice</h3>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedAdvice.content}</p>
                                </div>
                                <div className="border-l border-gray-200 pl-6">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Brain className="w-5 h-5 text-purple-600" /> AI Simplified</h3>
                                    {isExplaining ? (
                                        <div className="flex items-center gap-2 text-purple-600"><Loader2 className="w-4 h-4 animate-spin" /> Thinking...</div>
                                    ) : (
                                        <p className="text-sm text-purple-900 bg-purple-50 p-3 rounded-lg">{aiExplanation}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}