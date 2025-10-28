import type { AgentConfig, AgentName } from './types';
import {
    OrchestratorIcon,
    CurriculumIcon,
    ContentIcon,
    AssessmentIcon,
    FeedbackIcon,
    TutoringIcon,
    ProgressIcon,
} from './components/Icons';

export const AGENT_CONFIG: { [key in AgentName]: Omit<AgentConfig, 'name'> } = {
    'Central Orchestrator': {
        role: 'Coordinates agents to achieve learning goals.',
        icon: OrchestratorIcon,
    },
    'Curriculum Agent': {
        role: 'Designs and structures the learning path.',
        icon: CurriculumIcon,
    },
    'Content Agent': {
        role: 'Generates and sources learning materials.',
        icon: ContentIcon,
    },
    'Assessment Agent': {
        role: 'Creates quizzes to evaluate understanding.',
        icon: AssessmentIcon,
    },
    'Feedback Agent': {
        role: 'Provides constructive feedback on performance.',
        icon: FeedbackIcon,
    },
    'Tutoring Agent': {
        role: 'Offers on-demand help and clarifies concepts.',
        icon: TutoringIcon,
    },
    'Progress Tracking Agent': {
        role: 'Monitors and visualizes learning progress.',
        icon: ProgressIcon,
    },
};
