import * as React from 'react';
import { AGENT_CONFIG } from '../constants';
import type { AgentConfig, AgentName } from '../types';
import { AgentCard } from './AgentCard';

const agentNames: AgentName[] = [
    'Central Orchestrator',
    'Curriculum Agent',
    'Content Agent',
    'Assessment Agent',
    'Feedback Agent',
    'Tutoring Agent',
    'Progress Tracking Agent',
];

interface OrchestraProps {
    activeAgent: AgentName | null;
    agentStatus: string;
}

export const Orchestra: React.FC<OrchestraProps> = ({ activeAgent, agentStatus }) => {
    return (
        <div className="bg-gray-800/50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-center">Agent Orchestra</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
                {agentNames.map((name) => {
                    const config: Omit<AgentConfig, 'name'> = AGENT_CONFIG[name];
                    return (
                        <AgentCard
                            key={name}
                            agent={{ name, ...config }}
                            isActive={activeAgent === name}
                            status={agentStatus}
                        />
                    )
                })}
            </div>
        </div>
    );
};
