import React, { useState } from 'react';
import { getFoodInfo } from '../services/geminiService';
import { BookOpenIcon, UserIcon } from './icons';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const NutritionGuide: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [conversation, setConversation] = useState<Message[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMessage: Message = { sender: 'user', text: query };
        setConversation(prev => [...prev, userMessage]);
        setQuery('');
        setIsLoading(true);
        setError(null);

        try {
            const responseText = await getFoodInfo(query);
            const aiMessage: Message = { sender: 'ai', text: responseText };
            setConversation(prev => [...prev, aiMessage]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            const errorMessage: Message = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
             setConversation(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md border border-base-200">
            <div className="flex items-center gap-4 border-b border-base-200 pb-4 mb-6">
                <BookOpenIcon className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-gray-800">Nutrition Guide</h2>
            </div>
            <p className="text-gray-600 mb-4">
                Ask your AI nutritionist anything about food, diets, or health. For example: "What are the health benefits of salmon?"
            </p>

            <div className="h-96 bg-base-100 rounded-lg p-4 flex flex-col space-y-4 overflow-y-auto mb-4">
                {conversation.length === 0 && (
                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-gray-500">Ask a question to start the conversation.</p>
                    </div>
                )}
                {conversation.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && <BookOpenIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />}
                        <div className={`max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-base-200'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                         {msg.sender === 'user' && <UserIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                         <BookOpenIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                         <div className="max-w-lg p-3 rounded-lg bg-base-200">
                           <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                           </div>
                         </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask a question..."
                        className="w-full p-3 border border-base-300 rounded-md focus:ring-primary focus:border-primary"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary-focus text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400"
                    >
                        Send
                    </button>
                </div>
                 {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
            </form>
        </div>
    );
};

export default NutritionGuide;