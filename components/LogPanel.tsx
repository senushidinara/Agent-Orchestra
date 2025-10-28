
import * as React from 'react';
import type { LogEntry } from '../types';
import { AGENT_CONFIG } from '../constants';

const LogItem: React.FC<{ entry: LogEntry }> = ({ entry }) => {
    const SourceIcon = AGENT_CONFIG[entry.source]?.icon;
    const TargetIcon = AGENT_CONFIG[entry.target]?.icon;

    return (
        <div className="p-3 bg-gray-900/50 rounded-md text-sm">
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                    {SourceIcon && <SourceIcon className="h-4 w-4 text-gray-400" />}
                    <span className="font-semibold">{entry.source}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                    {TargetIcon && <TargetIcon className="h-4 w-4 text-gray-400" />}
                    <span className="font-semibold">{entry.target}</span>
                </div>
                <time className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleTimeString()}</time>
            </div>
            <p className="text-gray-300 text-xs pl-1">{entry.message}</p>
            {entry.confidence && (
                <div className="text-right text-xs text-gray-500 mt-1">Confidence: {(entry.confidence * 100).toFixed(0)}%</div>
            )}
        </div>
    );
};


export const LogPanel: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
    const logContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="p-4 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-white flex-shrink-0">Orchestration Log</h2>
            <div ref={logContainerRef} className="flex-grow overflow-y-auto pr-2 space-y-2">
                {logs.length > 0 ? (
                    logs.map((log) => <LogItem key={log.id} entry={log} />)
                ) : (
                    <div className="text-gray-500 text-center pt-8">
                        Logs will appear here as agents work.
                    </div>
                )}
            </div>
        </div>
    );
};
