// Fix: Import React to provide the type for React.FC, which is used in the AgentConfig interface.
import type React from 'react';

export type AgentName =
    | 'Central Orchestrator'
    | 'Curriculum Agent'
    | 'Content Agent'
    | 'Assessment Agent'
    | 'Feedback Agent'
    | 'Tutoring Agent'
    | 'Progress Tracking Agent';

export interface AgentConfig {
    name: AgentName;
    role: string;
    icon: React.FC<{ className?: string }>;
}

export interface LogEntry {
    id: number;
    timestamp: string;
    source: AgentName | 'System';
    target: AgentName;
    intent: string;
    message: string;
    confidence?: number;
    rationale?: string;
}

export interface CurriculumModule {
    title: string;
    description: string;
}

export interface Curriculum {
    title: string;
    modules: CurriculumModule[];
}

export interface AssessmentQuestion {
    question: string;
    options: string[];
}

export interface Assessment {
    title: string;
    questions: AssessmentQuestion[];
}

export interface AgentResponse<T> {
    intent: string;
    confidence: number;
    rationale?: string;
    payload: T;
}
