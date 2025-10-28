import * as React from 'react';
import { TabContentWrapper } from '../shared/TabContentWrapper';
import { ActionButton } from '../shared/ActionButton';
import type { Assessment, UserAnswers } from '../../types';

interface AssessmentTabProps {
    assessment: Assessment | null;
    onSubmit: (answers: UserAnswers) => void;
    isSubmitting: boolean;
}

export const AssessmentTab: React.FC<AssessmentTabProps> = ({ assessment, onSubmit, isSubmitting }) => {
    const [answers, setAnswers] = React.useState<UserAnswers>({});

    React.useEffect(() => {
        // Reset answers if the assessment changes
        setAnswers({});
    }, [assessment]);

    const handleAnswerChange = (questionIndex: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(answers);
    };

    const allQuestionsAnswered = assessment
        ? assessment.questions.length > 0 && assessment.questions.length === Object.keys(answers).length
        : false;

    return (
        <TabContentWrapper
            title="Knowledge Check"
            description="The Assessment Agent has prepared these questions to test your understanding. Answer them to the best of your ability."
        >
            {assessment ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {assessment.questions.map((q, index) => (
                        <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                            <p className="font-semibold mb-3">{`${index + 1}. ${q.question}`}</p>
                            <div className="space-y-2">
                                {q.options.map((option, optionIndex) => (
                                    <label key={optionIndex} className="flex items-center p-2 rounded-md hover:bg-gray-700/50 cursor-pointer transition-colors">
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={option}
                                            checked={answers[String(index)] === option}
                                            onChange={() => handleAnswerChange(String(index), option)}
                                            className="h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500"
                                        />
                                        <span className="ml-3 text-gray-300">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end pt-4">
                        <ActionButton type="submit" disabled={!allQuestionsAnswered || isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Answers'}
                        </ActionButton>
                    </div>
                </form>
            ) : (
                <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                    The assessment will appear here once the learning content is generated.
                </div>
            )}
        </TabContentWrapper>
    );
};
