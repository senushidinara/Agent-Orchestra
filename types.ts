import type * as React from 'react';

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

export interface CurriculumModule {
    title: string;
    description: string;
}

export interface Curriculum {
    title: string;
    modules: CurriculumModule[];
}

export type Content = {
    [moduleTitle: string]: string;
};

export interface QuizQuestion {
    question: string;
    options: string[];
}

export interface Assessment {
    title: string;
    questions: QuizQuestion[];
}

export type UserAnswers = {
    [questionIndex: number]: number; // value is the index of the selected option
};

export interface Feedback {
    overallScore: number; // e.g. 80 for 80%
    feedbackPerQuestion: {
        isCorrect: boolean;
        correctAnswer: string; // The text of the correct answer
        explanation: string;
    }[];
}

export interface ChatMessage {
    sender: 'user' | 'agent';
    text: string;
}
