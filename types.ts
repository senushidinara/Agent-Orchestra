import type { FC } from 'react';

export type AgentName =
    | 'Central Orchestrator'
    | 'Curriculum Agent'
    | 'Content Agent'
    | 'Assessment Agent'
    | 'Feedback Agent'
    | 'Tutoring Agent'
    | 'Progress Tracking Agent'
    | 'System'
    | 'User';

export interface AgentConfig {
    name: AgentName;
    role: string;
    icon: FC<{ className?: string }>;
}

export interface LogEntry {
    id: string;
    timestamp: string;
    source: AgentName;
    target: AgentName;
    intent: string;
    message: string;
    confidence?: number;
}

export interface CurriculumModule {
    title: string;
    description: string;
}

export interface Curriculum {
    title: string;
    modules: CurriculumModule[];
}

export interface Question {
    question: string;
    options: string[];
    correct_answer_index: number;
}

export interface Assessment {
    title: string;
    questions: Question[];
}

export interface Content {
    [moduleTitle: string]: string; // Maps module title to its markdown content
}

// FIX: Added LearningPackage interface to centralize type definitions.
export interface LearningPackage {
    curriculum: Curriculum;
    content: Content;
    assessment: Assessment;
}

export interface ChatMessage {
    sender: 'user' | 'agent';
    text: string;
}