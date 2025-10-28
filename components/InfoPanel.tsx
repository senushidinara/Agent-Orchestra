import * as React from 'react';
import type { AgentName } from '../types';
import { AGENT_CONFIG } from '../constants';

interface InfoPanelProps {
    currentAgent: AgentName;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ currentAgent }) => {
    const agentConfig = AGENT_CONFIG[currentAgent];

    if (!agentConfig) {
        return (
            <div>
                <h2 className="text-lg font-semibold mb-2 text-white">Agent Info</h2>
                <p className="text-gray-400">No agent selected.</p>
            </div>
        );
    }

    const { role, icon: Icon } = agentConfig;

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Active Agent Info</h2>
            <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gray-700/50 rounded-md text-cyan-400">
                    <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-xl text-cyan-300">{currentAgent}</h3>
            </div>
            <div>
                <p className="text-sm text-gray-400 font-medium">Role:</p>
                <p className="text-gray-300">{role}</p>
            </div>
        </div>
    );
};
