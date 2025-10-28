
import * as React from 'react';

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
    icon: React.FC<{ className?: string }>;
}

export interface LogEntry {
    id: string;
    timestamp: number;
    source: AgentName;
    target: AgentName;
    message: string;
    confidence?: number;
}

export interface Module {
    title: string;
    description: string;
}

export interface Curriculum {
    title: string;
    modules: Module[];
}

export type Content = {
    [moduleTitle: string]: string; // Markdown content for each module
};

export interface Question {
    question: string;
    options: string[];
}

export interface Assessment {
    title: string;
    questions: Question[];
}

export interface LearningPackage {
    curriculum: Curriculum;
    content: Content;
    assessment: Assessment;
}

export interface ChatMessage {
    sender: 'user' | 'agent';
    text: string;
}
