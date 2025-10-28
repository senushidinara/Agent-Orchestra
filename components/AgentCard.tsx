import * as React from 'react';
import type { AgentConfig } from '../types';

interface AgentCardProps {
    agent: AgentConfig;
    isThinking: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, isThinking }) => {
    const Icon = agent.icon;
    return (
        <div className={`bg-gray-800/80 p-4 rounded-lg flex items-center gap-4 transition-all duration-300 ${isThinking ? 'ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/20' : 'ring-1 ring-gray-700'}`}>
            <div className={`p-2 rounded-full ${isThinking ? 'bg-cyan-500/20' : 'bg-gray-700'}`}>
                <Icon className={`w-8 h-8 ${isThinking ? 'text-cyan-400 animate-pulse' : 'text-gray-400'}`} />
            </div>
            <div>
                <h3 className="font-semibold">{agent.name}</h3>
                <p className="text-sm text-gray-400">{agent.role}</p>
            </div>
        </div>
    );
};