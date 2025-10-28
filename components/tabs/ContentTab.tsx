
import * as React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TabContentWrapper } from '../shared/TabContentWrapper';
import type { Curriculum, Content } from '../../types';

// Custom components for rendering markdown with a futuristic, stylish look
const customComponents: Components = {
    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-cyan-400 border-b-2 border-gray-700 pb-2 mb-4" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-white mt-6 mb-3" {...props} />,
    p: ({ node, ...props }) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
    ul: ({ node, ...props }) => <ul className="space-y-2 list-none pl-2" {...props} />,
    li: ({ node, ...props }) => (
        <li className="flex items-start">
            <svg className="h-5 w-5 text-cyan-400 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="flex-1">{props.children}</span>
        </li>
    ),
    blockquote: ({ node, ...props }) => (
        <blockquote className="bg-cyan-900/20 border border-cyan-500/30 p-4 my-6 rounded-lg shadow-lg backdrop-blur-sm">
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                    <svg className="h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                </div>
                <div className="ml-4 text-cyan-100/90">
                    {props.children}
                </div>
            </div>
        </blockquote>
    ),
    code: ({ node, inline, ...props }: any) => {
        if (inline) {
            return <code className="bg-gray-700 text-fuchsia-300 px-1.5 py-0.5 rounded-md text-sm" {...props} />;
        }
        return <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto"><code className="text-fuchsia-300" {...props} /></pre>;
    },
    a: ({ node, ...props }) => <a className="text-cyan-400 hover:text-cyan-300 underline transition-colors" {...props} />,
};

interface ContentTabProps {
    curriculum: Curriculum | null;
    content: Content | null;
}

export const ContentTab: React.FC<ContentTabProps> = ({ curriculum, content }) => {
    const [selectedModuleIndex, setSelectedModuleIndex] = React.useState(0);

    const hasContent = curriculum && content && curriculum.modules.length > 0;
    
    // Reset selected module if curriculum changes to avoid out-of-bounds index
    React.useEffect(() => {
        setSelectedModuleIndex(0);
    }, [curriculum]);

    const selectedModule = hasContent ? curriculum.modules[selectedModuleIndex] : null;
    const moduleContent = selectedModule && content ? content[selectedModule.title] : '';

    return (
        <TabContentWrapper
            title="Learning Content"
            description="The Content Agent has generated this material. Select a module to begin learning."
        >
            {hasContent ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
                    <div className="md:col-span-1">
                        <nav className="space-y-2">
                            {curriculum.modules.map((module, index) => {
                                const isActive = index === selectedModuleIndex;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedModuleIndex(index)}
                                        className={`w-full text-left p-3 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                                            isActive ? 'bg-cyan-600 text-white font-semibold' : 'bg-gray-700/50 hover:bg-gray-700'
                                        }`}
                                    >
                                        {`${index + 1}. ${module.title}`}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="md:col-span-3 h-full overflow-y-auto bg-gray-900/50 p-6 rounded-lg custom-scrollbar">
                         <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={customComponents}
                         >
                            {moduleContent}
                         </ReactMarkdown>
                    </div>
                </div>
            ) : (
                <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                    Learning content will appear here after the curriculum is generated.
                </div>
            )}
        </TabContentWrapper>
    );
};
