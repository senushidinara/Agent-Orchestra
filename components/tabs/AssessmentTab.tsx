
import * as React from 'react';
import { TabContentWrapper } from '../shared/TabContentWrapper';
import { ActionButton } from '../shared/ActionButton';
import type { Assessment, UserAnswers, AssessmentQuestion } from '../../types';

interface AssessmentTabProps {
    assessment: Assessment | null;
    onSubmit: (answers: UserAnswers) => void;
}

const QuestionCard: React.FC<{
    question: AssessmentQuestion;
    questionIndex: number;
    userAnswer: string | undefined;
    onAnswerChange: (questionIndex: number, answer: string) => void;
}> = ({ question, questionIndex, userAnswer, onAnswerChange }) => {
    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="font-semibold mb-3">{`${questionIndex + 1}. ${question.question}`}</p>
            <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700/50 transition-colors cursor-pointer">
                        <input
                            type="radio"
                            name={`question-${questionIndex}`}
                            value={option}
                            checked={userAnswer === option}
                            onChange={(e) => onAnswerChange(questionIndex, e.target.value)}
                            className="form-radio h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500"
                        />
                        <span className="text-gray-300">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};


export const AssessmentTab: React.FC<AssessmentTabProps> = ({ assessment, onSubmit }) => {
    const [answers, setAnswers] = React.useState<UserAnswers>({});

    // Reset answers when a new assessment is loaded
    React.useEffect(() => {
        setAnswers({});
    }, [assessment]);

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const allQuestionsAnswered = assessment && Object.keys(answers).length === assessment.questions.length;

    const handleSubmit = () => {
        if (allQuestionsAnswered) {
            onSubmit(answers);
        }
    };

    return (
        <TabContentWrapper
            title="Knowledge Check"
            description="The Assessment Agent has prepared these questions to test your understanding. Answer them to the best of your ability."
        >
            {assessment ? (
                <div className="space-y-6">
                    {assessment.questions.map((q, index) => (
                        <QuestionCard
                            key={index}
                            question={q}
                            questionIndex={index}
                            userAnswer={answers[index] as string | undefined}
                            onAnswerChange={handleAnswerChange}
                        />
                    ))}
                    <div className="flex justify-end pt-4">
                        <ActionButton
                            onClick={handleSubmit}
                            disabled={!allQuestionsAnswered}
                            title={!allQuestionsAnswered ? 'Please answer all questions' : ''}
                        >
                            Submit for Feedback
                        </ActionButton>
                    </div>
                </div>
            ) : (
                <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                    The assessment will appear here once the learning package is generated.
                </div>
            )}
        </TabContentWrapper>
    );
};
