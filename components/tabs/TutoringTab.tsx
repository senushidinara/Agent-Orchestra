import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TabContentWrapper } from '../shared/TabContentWrapper';
import { ActionButton } from '../shared/ActionButton';
import type { Curriculum, Content, ChatMessage } from '../../types';
import { getTutoringResponse } from '../../services/geminiService';

interface TutoringTabProps {
    curriculum: Curriculum | null;
    content: Content | null;
}

export const TutoringTab: React.FC<TutoringTabProps> = ({ curriculum, content }) => {
    const [messages, setMessages] = React.useState<ChatMessage[]>([]);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const chatContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Combine all content into a single context string
            const context = content ? Object.entries(content).map(([title, md]) => `Module: ${title}\n\n${md}`).join('\n\n---\n\n') : 'No content available.';
            const responseText = await getTutoringResponse(input, context);
            const agentMessage: ChatMessage = { sender: 'agent', text: responseText };
            setMessages(prev => [...prev, agentMessage]);
        } catch (error) {
            console.error("Error getting tutoring response:", error);
            const errorMessage: ChatMessage = { sender: 'agent', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const hasContent = curriculum && content;

    return (
        <TabContentWrapper
            title="AI Tutor"
            description="Ask questions about the learning material. The Tutoring Agent will help clarify concepts based on the generated content."
        >
            {hasContent ? (
                <div className="flex flex-col h-full">
                    <div ref={chatContainerRef} className="flex-grow overflow-y-auto mb-4 p-4 bg-gray-900/30 rounded-lg space-y-4">
                        {messages.length === 0 && <div className="text-gray-500 text-center">Ask me anything about the course content!</div>}
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xl p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-800 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    <article className="prose prose-invert prose-sm max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                    </article>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-xl p-3 rounded-lg bg-gray-700 text-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question..."
                            className="flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            disabled={isLoading}
                        />
                        <ActionButton type="submit" disabled={!input.trim() || isLoading}>
                            Send
                        </ActionButton>
                    </form>
                </div>
            ) : (
                 <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                    A learning package must be generated before you can use the tutor.
                </div>
            )}
        </TabContentWrapper>
    );
};
