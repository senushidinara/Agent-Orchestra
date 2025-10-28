import * as React from 'react';
import type { AgentConfig } from '../types';

interface AgentCardProps {
    agent: AgentConfig;
    isActive: boolean;
    status: string;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, isActive, status }) => {
    const { name, role, icon: Icon } = agent;
    const activeClasses = isActive ? 'border-cyan-400 shadow-lg shadow-cyan-500/10' : 'border-gray-700';
    const activeText = isActive ? 'text-cyan-300' : 'text-gray-400';

    return (
        <div className={`bg-gray-800/50 p-3 rounded-lg border ${activeClasses} transition-all duration-300 flex items-center space-x-3`}>
            <div className={`p-2 bg-gray-700/50 rounded-md ${isActive ? 'text-cyan-400' : 'text-gray-500'}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
                <h3 className="font-semibold text-white">{name}</h3>
                <p className={`text-xs ${activeText}`}>{isActive ? status : role}</p>
            </div>
        </div>
    );
};
