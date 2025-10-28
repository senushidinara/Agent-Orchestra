import * as React from 'react';
import { TabContentWrapper } from '../shared/TabContentWrapper';
import type { Curriculum } from '../../types';

interface CurriculumTabProps {
    curriculum: Curriculum | null;
}

export const CurriculumTab: React.FC<CurriculumTabProps> = ({ curriculum }) => {
    return (
        <TabContentWrapper
            title="Your Learning Curriculum"
            description="The Curriculum Agent has designed this learning path for you. Review the modules below to understand the structure of your course."
        >
            {curriculum ? (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-cyan-400">{curriculum.title}</h3>
                    <div className="space-y-3 pl-4 border-l-2 border-gray-700">
                        {curriculum.modules.map((module, index) => (
                            <div key={index}>
                                <h4 className="font-semibold text-white">{`${index + 1}. ${module.title}`}</h4>
                                <p className="text-gray-400 text-sm">{module.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                    The curriculum will be generated here once you start a learning journey.
                </div>
            )}
        </TabContentWrapper>
    );
};
