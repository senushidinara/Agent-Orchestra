import * as React from 'react';
import { TabContentWrapper } from '../shared/TabContentWrapper';
import type { Assessment, Feedback } from '../../types';

interface DonutChartProps {
    score: number;
    size?: number;
    strokeWidth?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ score, size = 100, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle
                className="text-gray-700"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            <circle
                className="text-cyan-400"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
             <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                className="text-2xl font-bold fill-white rotate-90 origin-center"
            >
                {`${score}%`}
            </text>
        </svg>
    );
};

const FeedbackAnswer: React.FC<{ title: string; answer: string | string[]; isCorrect?: boolean }> = ({ title, answer, isCorrect }) => {
    const isCorrectDefined = typeof isCorrect !== 'undefined';
    const bgColor = isCorrectDefined ? (isCorrect ? 'bg-green-900/40' : 'bg-red-900/40') : 'bg-gray-700/50';
    const borderColor = isCorrectDefined ? (isCorrect ? 'border-green-600/50' : 'border-red-600/50') : 'border-gray-600/50';
    const icon = isCorrectDefined ? (
        isCorrect ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
        ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
        )
    ) : null;

    return (
        <div className={`p-3 rounded-lg border ${bgColor} ${borderColor}`}>
            <h5 className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-1">
                {icon} {title}
            </h5>
            <p className="text-white">{Array.isArray(answer) ? answer.join(', ') : answer}</p>
        </div>
    )
};

interface FeedbackTabProps {
    feedback: Feedback | null;
    assessment: Assessment | null;
}

export const FeedbackTab: React.FC<FeedbackTabProps> = ({ feedback, assessment }) => {
    return (
        <TabContentWrapper
            title="Assessment Feedback"
            description="The Feedback Agent has analyzed your answers. Review your performance below to identify areas for improvement."
        >
            {feedback ? (
                <div className="space-y-6">
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-semibold mb-3">Overall Performance</h3>
                        <div className="flex items-center gap-6">
                            <DonutChart score={feedback.score} />
                            <p className="text-gray-300 flex-1">{feedback.overallFeedback}</p>
                        </div>
                    </div>
                    <div>
                         <h3 className="text-lg font-semibold mb-3">Question Breakdown</h3>
                         <div className="space-y-4">
                            {feedback.questionFeedback.map((qf, index) => (
                                <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 space-y-3">
                                    <p className="font-semibold">{`${index + 1}. ${qf.question}`}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <FeedbackAnswer title="Your Answer" answer={qf.userAnswer} isCorrect={qf.isCorrect} />
                                        <FeedbackAnswer title="Correct Answer" answer={qf.correctAnswer} isCorrect={true} />
                                    </div>

                                    <div className="p-3 rounded-md text-sm bg-gray-900/50">
                                        <h5 className="font-semibold text-gray-300 mb-1">Explanation</h5>
                                        <p className="text-gray-400">{qf.explanation}</p>
                                    </div>
                                    
                                    {!qf.isCorrect && (
                                        <div className="p-3 rounded-md text-sm bg-cyan-900/30 border border-cyan-500/30">
                                            <h5 className="font-semibold text-cyan-300 mb-1 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v1a1 1 0 11-2 0v-1a1 1 0 112 0zM12 16v1a1 1 0 11-2 0v-1a1 1 0 112 0zM14.95 14.95a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM10 2a4 4 0 00-4 4v1a1 1 0 01-2 0V6a6 6 0 0112 0v1a1 1 0 01-2 0V6a4 4 0 00-4-4z" /></svg>
                                                Suggestion
                                            </h5>
                                            <p className="text-cyan-200">{qf.suggestion}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            ) : (
                <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                    Submit the assessment to see your feedback here.
                </div>
            )}
        </TabContentWrapper>
    );
};
