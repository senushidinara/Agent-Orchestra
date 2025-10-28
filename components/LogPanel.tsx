import * as React from 'react';
import type { LogEntry } from '../types';

interface LogPanelProps {
    logs: LogEntry[];
}

const AGENT_COLORS: Record<string, { text: string; bg: string }> = {
    'System': { text: 'text-gray-400', bg: 'bg-gray-600' },
    'Central Orchestrator': { text: 'text-cyan-400', bg: 'bg-cyan-900' },
    'Curriculum Agent': { text: 'text-purple-400', bg: 'bg-purple-900' },
    'Content Agent': { text: 'text-blue-400', bg: 'bg-blue-900' },
    'Assessment Agent': { text: 'text-green-400', bg: 'bg-green-900' },
    'Feedback Agent': { text: 'text-yellow-400', bg: 'bg-yellow-900' },
    'Tutoring Agent': { text: 'text-orange-400', bg: 'bg-orange-900' },
    'Progress Tracking Agent': { text: 'text-pink-400', bg: 'bg-pink-900' },
};

const ConfidenceBar: React.FC<{ score: number }> = ({ score }) => (
    <div className="w-full bg-gray-700 rounded-full h-1.5">
        <div
            className="bg-cyan-400 h-1.5 rounded-full"
            style={{ width: `${score * 100}%` }}
        ></div>
    </div>
);

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const getAgentColor = (agentName: string) => AGENT_COLORS[agentName] || AGENT_COLORS['System'];

    return (
        <div ref={scrollRef} className="h-full overflow-y-auto p-4 font-sans text-sm space-y-3 flex-grow">
            {logs.map((log) => {
                const sourceColor = getAgentColor(log.source);
                const targetColor = getAgentColor(log.target);
                return (
                    <div key={log.id} className="bg-gray-900/70 border border-gray-700 rounded-lg p-3 animate-fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${sourceColor.bg} ${sourceColor.text}`}>
                                    {log.source.replace(' Agent', '')}
                                </span>
                                <span className="text-gray-500">→</span>
                                 <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${targetColor.bg} ${targetColor.text}`}>
                                    {log.target.replace(' Agent', '')}
                                </span>
                            </div>
                            <div className="text-gray-500 text-xs">{log.timestamp}</div>
                        </div>
                        
                        <div className="mb-2">
                            <span className="text-gray-500 font-mono text-xs mr-2">INTENT:</span>
                            <span className="font-semibold text-gray-300">{log.intent}</span>
                        </div>

                        <p className="text-gray-400 text-xs leading-relaxed mb-3">
                           <span className="font-mono text-gray-500">RATIONALE: </span> 
                           {log.message}
                        </p>

                        {log.confidence !== undefined && (
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-500 font-mono text-xs">CONFIDENCE</span>
                                    <span className="text-cyan-400 font-semibold text-xs">{(log.confidence * 100).toFixed(0)}%</span>
                                </div>
                                <ConfidenceBar score={log.confidence} />
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    );
};