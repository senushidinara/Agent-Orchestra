import * as React from 'react';
import type { AgentConfig, AgentName } from '../types';
import { AgentCard } from './AgentCard';

interface OrchestraProps {
    agents: AgentConfig[];
    isThinking: Record<AgentName, boolean>;
}

export const Orchestra: React.FC<OrchestraProps> = ({ agents, isThinking }) => {
    return (
        <div className="bg-gray-800/50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-center">Agent Orchestra</h2>
            <div className="space-y-3">
                {agents.map(agent => (
                    <AgentCard key={agent.name} agent={agent} isThinking={!!isThinking[agent.name]} />
                ))}
            </div>
        </div>
    );
};