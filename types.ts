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
    [moduleTitle: string]: string; // Markdown content for each module
};

export interface AssessmentQuestion {
    question: string;
    options: string[];
    type: 'multiple-choice' | 'short-answer';
}

export interface Assessment {
    title: string;
    questions: AssessmentQuestion[];
}

export type UserAnswers = {
    [questionIndex: string]: string | string[]; // answer for each question
};

export interface QuestionFeedback {
    question: string;
    userAnswer: string | string[];
    correctAnswer: string | string[];
    isCorrect: boolean;
    explanation: string;
    suggestion: string; // New field for actionable advice
}

export interface Feedback {
    overallFeedback: string;
    score: number; // e.g., 80 for 80%
    questionFeedback: QuestionFeedback[];
}

export interface ChatMessage {
    sender: 'user' | 'agent';
    text: string;
}
