import * as React from 'react';
import { TabContentWrapper } from '../shared/TabContentWrapper';
import type { Curriculum, Content } from '../../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ContentTabProps {
    curriculum: Curriculum | null;
    content: Content | null;
}

export const ContentTab: React.FC<ContentTabProps> = ({ curriculum, content }) => {
    const [selectedModule, setSelectedModule] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (curriculum && curriculum.modules.length > 0) {
            setSelectedModule(curriculum.modules[0].title);
        } else {
            setSelectedModule(null);
        }
    }, [curriculum]);


    const moduleContent = selectedModule && content ? content[selectedModule] : null;

    return (
        <TabContentWrapper
            title="Learning Content"
            description="The Content Agent has generated detailed materials for each module. Select a module to view its content."
        >
            {curriculum && content ? (
                <div className="flex gap-6 h-full">
                    <div className="w-1/3">
                        <h3 className="font-semibold mb-3">Modules</h3>
                        <ul className="space-y-2">
                            {curriculum.modules.map((module, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => setSelectedModule(module.title)}
                                        className={`w-full text-left p-3 rounded-md transition-colors ${selectedModule === module.title ? 'bg-cyan-600/50 text-white' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}
                                    >
                                        {`${index + 1}. ${module.title}`}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-2/3 flex-grow overflow-y-auto pr-2">
                        {moduleContent ? (
                             <article className="prose prose-invert prose-sm max-w-none bg-gray-900/30 p-4 rounded-md">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{moduleContent}</ReactMarkdown>
                            </article>
                        ) : (
                             <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg h-full flex items-center justify-center">
                                Select a module to see its content.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                    Content will be generated here after the curriculum is created.
                </div>
            )}
        </TabContentWrapper>
    );
};
