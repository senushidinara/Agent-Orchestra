import * as React from 'react';
import { TabContentWrapper } from '../shared/TabContentWrapper';
import type { Curriculum } from '../../types';

interface CurriculumTabProps {
    curriculum: Curriculum | null;
}

export const CurriculumTab: React.FC<CurriculumTabProps> = ({ curriculum }) => {
    return (
        <TabContentWrapper
            title="Generated Curriculum"
            description="The Curriculum Agent has designed the following learning path based on your request. You can see the generated content for each module in the 'Content' tab."
        >
            {curriculum ? (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-cyan-400">{curriculum.title}</h3>
                    {curriculum.modules.map((module, index) => (
                        <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                            <h4 className="font-semibold text-lg">{`${index + 1}. ${module.title}`}</h4>
                            <p className="text-gray-400 mt-1">{module.description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                    The curriculum will be generated here once you start a learning journey.
                </div>
            )}
        </TabContentWrapper>
    );
};