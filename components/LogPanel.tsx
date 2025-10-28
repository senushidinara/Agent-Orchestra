import * as React from 'react';
import type { LogEntry } from '../types';
import { AGENT_CONFIG } from '../constants';

interface LogPanelProps {
    logs: LogEntry[];
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
    const logContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col h-[400px]">
            <h2 className="text-lg font-semibold mb-4 text-center">Orchestration Log</h2>
            <div ref={logContainerRef} className="flex-grow overflow-y-auto space-y-3 pr-2 text-sm">
                {logs.map((log) => {
                    const SourceIcon = AGENT_CONFIG[log.source]?.icon;
                    const TargetIcon = AGENT_CONFIG[log.target]?.icon;

                    return (
                        <div key={log.id} className="p-3 bg-gray-900/50 rounded-md border border-gray-700">
                             <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-1">
                                        {SourceIcon && <SourceIcon className="h-4 w-4" />} {log.source}
                                    </span>
                                    <span>→</span>
                                     <span className="flex items-center gap-1">
                                        {TargetIcon && <TargetIcon className="h-4 w-4" />} {log.target}
                                    </span>
                                </div>
                                <span>{log.timestamp}</span>
                            </div>
                            <p className="font-medium text-gray-300">Intent: <span className="font-normal text-cyan-400">{log.intent}</span></p>
                            <p className="text-gray-400 mt-1">{log.message}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
