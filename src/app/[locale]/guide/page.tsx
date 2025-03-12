"use client"
import React from "react";
import { Card } from "@/components/ui/card";
import { DemoCard } from "@/components/card/demo-card";
import {useTranslations} from 'next-intl';

const App: React.FC = () => {
    const t = useTranslations('guide');
    
    return (
        <div className="min-h-screen bg-gray-50 text-[18px] tracking-[0.4px] leading-[1.9]">
            <div className="max-w-[1440px] mx-auto px-8">
                {/* Hero Section */}
                <div className="text-center mb-4">
                    <h1 className="text-4xl font-bold mb-4">
                        {t('title')}
                    </h1>
                    <p className="text-gray-600 text-lg text-black/60">
                        {t('subtitle')}
                    </p>
                </div>
                {/* Core Concept Section */}
                <Card className="p-8 mb-4 bg-white border-none shadow-none">
                    <h2 className="text-2xl font-semibold text-center mb-8">
                        {t('core.title')}
                    </h2>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                            {t('core.description')}
                        </p>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-700">
                                    {t('core.methods.subtitles')}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-700">
                                    {t('core.methods.copy')}
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-600 italic text-black/60">
                            {t('core.future')}
                        </p>
                        <p className="text-gray-700 text-lg mt-8 mb-4 leading-relaxed">
                            {t('core.demo.intro')}
                        </p>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                                <span className="text-gray-700">
                                    {t('core.demo.shadow')}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span className="text-gray-700">
                                    {t('core.demo.dictation')}
                                </span>
                            </div>
                        </div>
                        <div className="mt-14 text-[16px]">
                            <DemoCard />
                        </div>
                    </div>
                </Card>
                {/* Getting Started Section */}
                <Card className="mb-12 bg-white border-none shadow-none">
                    <h2 className="text-2xl font-semibold text-center mb-8">
                        {t('getStarted.title')}
                    </h2>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-gray-700 mb-8">
                            {t('getStarted.intro')}
                        </p>
                        <div className="pr-4 text-[16px]">
                            <div className="space-y-8">
                                <div className="border-l-4 border-blue-500 pl-6">
                                    <h3 className="text-xl font-medium mb-2">
                                        {t('getStarted.steps.extension.title')}
                                    </h3>
                                    <p className="text-gray-700">
                                        {t.rich('getStarted.steps.extension.description', {
                                            link: (chunks) => (
                                                <a href="https://chromewebstore.google.com/detail/fpaloochihjldiaigldijhbmgjjjicoa?utm_source=item-share-cp" 
                                                   target="_blank" 
                                                   rel="noopener noreferrer" 
                                                   className="text-blue-500 hover:text-blue-700 hover:underline"
                                                >
                                                    {chunks}
                                                </a>
                                            )
                                        })}
                                    </p>
                                </div>
                                <div className="border-l-4 border-blue-500 pl-6">
                                    <h3 className="text-xl font-medium mb-2">
                                        {t('getStarted.steps.videos.title')}
                                    </h3>
                                    <p className="text-gray-700">
                                        {t('getStarted.steps.videos.description')}
                                    </p>
                                </div>
                                <div className="border-l-4 border-blue-500 pl-6">
                                    <h3 className="text-xl font-medium mb-2">
                                        {t('getStarted.steps.copy.title')}
                                    </h3>
                                    <p className="text-gray-700">
                                        {t('getStarted.steps.copy.description')}
                                    </p>
                                </div>
                                <div className="border-l-4 border-blue-500 pl-6">
                                    <h3 className="text-xl font-medium mb-2">
                                        {t('getStarted.steps.paste.title')}
                                    </h3>
                                    <p className="text-gray-700">
                                        {t.rich('getStarted.steps.paste.description', {
                                            link: (chunks) => (
                                                <a href="https://japanese-memory-rsc.vercel.app/memo-cards" 
                                                   target="_blank" 
                                                   rel="noopener noreferrer" 
                                                   className="text-blue-500 hover:text-blue-700 hover:underline"
                                                >
                                                    {chunks}
                                                </a>
                                            )
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 mt-8">
                            {t.rich('getStarted.review', {
                                button: (chunks) => (
                                    <button 
                                        onClick={() => {
                                            const demoCard = document.querySelector('.mt-14');
                                            if (demoCard) {
                                                demoCard.scrollIntoView({
                                                    behavior: 'smooth',
                                                    block: 'center'
                                                });
                                                
                                                const clickMe = document.createElement('div');
                                                clickMe.className = 'absolute -top-10 right-0 text-blue-500 font-medium animate-fadeInOut';
                                                clickMe.textContent = t('getStarted.clickMe');
                                                clickMe.style.zIndex = '30';
                                                
                                                const existingClickMe = document.querySelector('.animate-fadeInOut');
                                                if (existingClickMe) {
                                                    existingClickMe.remove();
                                                }
                                                
                                                const demoCardElement = document.querySelector('.mt-14') as HTMLElement;
                                                if (demoCardElement) {
                                                    if (demoCardElement.style.position !== 'relative') {
                                                        demoCardElement.style.position = 'relative';
                                                    }
                                                    demoCardElement.appendChild(clickMe);
                                                    
                                                    setTimeout(() => {
                                                        clickMe.classList.add('animate-fadeOut');
                                                        setTimeout(() => {
                                                            if (clickMe.parentNode) {
                                                                clickMe.parentNode.removeChild(clickMe);
                                                            }
                                                        }, 500);
                                                    }, 2500);
                                                }
                                            }
                                        }}
                                        className="text-blue-500 hover:text-blue-700 hover:underline"
                                    >
                                        {chunks}
                                    </button>
                                )
                            })}
                        </p>
                        <p className="text-gray-700 mt-12 flex items-center gap-2">
                            {t.rich('getStarted.recommendation.intro', {
                                channel: (chunks) => (
                                    <span className="flex items-center group">
                                        <a href="https://www.youtube.com/@marymarymary80s" target="_blank" rel="noopener noreferrer">
                                            <img src="https://yt3.googleusercontent.com/x4eKHmgtnTU3xjqL3uP7sSJadSbaBIJL0g0T-dxo6veLCixHLxvg_4d8g9iF4Bcom1evobHjAg=s160-c-k-c0x00ffffff-no-rj" 
                                                alt="Mary's channel avatar"
                                                className="w-[30px] h-[30px] rounded-full"
                                            />
                                        </a>
                                        <a href="https://www.youtube.com/@marymarymary80s" target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:text-blue-700 group-hover:underline">
                                            {chunks}
                                        </a>
                                    </span>
                                )
                            })}
                        </p>
                        <ul className="space-y-3 text-gray-700 mt-4">
                            {(t.raw('getStarted.recommendation.reasons') as string[]).map((reason: string, index: number) => (
                                <li key={index}>• {reason}</li>
                            ))}
                        </ul>
                        <p className="text-gray-700 mt-8">
                            {t('getStarted.netflix')}
                        </p>
                    </div>
                </Card>

                {/* What If I Can't Remember Section */}
                <Card className="mb-8 bg-white border-none shadow-none">
                    <h2 className="text-2xl font-semibold text-center mb-12">
                        {t('remember.title')}
                    </h2>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-gray-700 mb-6">
                            {t('remember.normal')}
                        </p>
                        
                        <p className="text-gray-700 mb-6">
                            {t('remember.key')}
                        </p>
                        
                        <ul className="space-y-3 text-gray-700 mt-4 mb-6">
                            {(t.raw('remember.methods') as string[]).map((method: string, index: number) => (
                                <li key={index}>• {method}</li>
                            ))}
                        </ul>
                        
                        <p className="text-gray-700">
                            {t('remember.conclusion')}
                        </p>
                    </div>
                </Card>

                {/* Summary Section */}
                <Card className="p-8 bg-white border-none shadow-none">
                    <h2 className="text-2xl font-semibold text-center mb-12">
                        {t('why.title')}
                    </h2>
                    <div className="max-w-3xl mx-auto">
                        <div className="text-gray-700 space-y-6">
                            <div className="mb-8">
                                <h3 className="text-xl font-medium mb-3">{t('why.sections.built.title')}</h3>
                                <p className="leading-relaxed">
                                    {t('why.sections.built.description')}
                                </p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-medium mb-3">{t('why.sections.serious.title')}</h3>
                                <p className="leading-relaxed">
                                    {t('why.sections.serious.description')}
                                </p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-medium mb-3">{t('why.sections.workflow.title')}</h3>
                                <p className="leading-relaxed">
                                    {t('why.sections.workflow.description')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 max-w-3xl mx-auto">
                        {t.rich('why.explore', {
                            link: (chunks) => (
                                <a href="https://japanese-memory-rsc.vercel.app/" 
                                   target="_blank" 
                                   rel="noopener noreferrer" 
                                   className="text-blue-500 hover:text-blue-700 hover:underline"
                                >
                                    {chunks}
                                </a>
                            )
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
};
export default App;
