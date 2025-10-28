
import * as React from 'react';
import { AgentCard } from './AgentCard';
import { AGENT_CONFIG } from '../constants';
import type { AgentName } from '../types';

interface OrchestraProps {
    currentAgent: AgentName;
    agentStatuses: { [key in AgentName]?: string };
}

const ALL_AGENTS: AgentName[] = [
    'Central Orchestrator',
    'Curriculum Agent',
    'Content Agent',
    'Assessment Agent',
    'Feedback Agent',
    'Tutoring Agent',
    'Progress Tracking Agent',
];

export const Orchestra: React.FC<OrchestraProps> = ({ currentAgent, agentStatuses }) => {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Agent Orchestra</h2>
            <div className="space-y-3">
                {ALL_AGENTS.map((agentName) => {
                    const config = { name: agentName, ...AGENT_CONFIG[agentName] };
                    const isActive = currentAgent === agentName;
                    const status = agentStatuses[agentName] || 'Idle';
                    
                    return (
                        <AgentCard
                            key={agentName}
                            agent={config}
                            isActive={isActive}
                            status={status}
                        />
                    );
                })}
            </div>
        </div>
    );
};
