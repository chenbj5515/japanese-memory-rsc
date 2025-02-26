// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
"use client"
import React from "react";
import { Card } from "@/components/ui/card";
import { DemoCard } from "@/components/card/demo-card";

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-[18px] tracking-[0.4px] leading-[1.9]">
            <div className="max-w-[1440px] mx-auto px-8">
                {/* Hero Section */}
                <div className="text-center mb-4">
                    <h1 className="text-4xl font-bold mb-4">
                        Design Philosophy of Bun
                    </h1>
                    <p className="text-gray-600 text-lg text-black/60">
                        learn gracefully, review effectively
                    </p>
                </div>
                {/* Core Concept Section */}
                <Card className="p-8 mb-4 bg-white border-none shadow-none">
                    <h2 className="text-2xl font-semibold text-center mb-8">
                        Sentences are Core
                    </h2>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                            Stop learning language without a system. Instead, make rapid
                            progress by focusing explicitly on sentences as core units. You
                            can obtain sentences through various methods:
                        </p>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-700">
                                    Get instant subtitles from YouTube/Netflix videos
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-700">
                                    Copy Japanese text directly from websites
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-600 italic text-black/60">
                            In the future, we will also support image input functionality to
                            make learning even more convenient.
                        </p>
                        <p className="text-gray-700 text-lg mt-8 mb-4 leading-relaxed">
                            Check out this interactive demo card that lets you practice with:
                        </p>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                                <span className="text-gray-700">
                                    Shadow reading - repeat after the audio to improve pronunciation
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span className="text-gray-700">
                                    Dictation - test if you can roughly remember the sentence
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
                        Where to Find Japanese Sentences
                    </h2>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-gray-700 mb-8">
                            While you're free to choose your sentence sources, I strongly
                            recommend trying the following process:
                        </p>
                        <div className="pr-4 text-[16px]">
                            <div className="space-y-8">
                                <div className="border-l-4 border-blue-500 pl-6">
                                    <h3 className="text-xl font-medium mb-2">
                                        1. Download the Extension
                                    </h3>
                                    <p className="text-gray-700">
                                        Install <a href="https://chromewebstore.google.com/detail/fpaloochihjldiaigldijhbmgjjjicoa?utm_source=item-share-cp" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline">my Chrome extension</a> from the Chrome Web Store.
                                    </p>
                                </div>
                                <div className="border-l-4 border-blue-500 pl-6">
                                    <h3 className="text-xl font-medium mb-2">
                                        2. Find Videos You Like
                                    </h3>
                                    <p className="text-gray-700">
                                        Choose videos on YouTube or Netflix. For YouTube videos,
                                        select ones with built-in subtitles (avoid using YouTube's
                                        caption feature as its sentence breaks are often poor and
                                        don't align with our sentence-centered approach).
                                    </p>
                                </div>
                                <div className="border-l-4 border-blue-500 pl-6">
                                    <h3 className="text-xl font-medium mb-2">
                                        3. Copy Subtitles
                                    </h3>
                                    <p className="text-gray-700">
                                        Press Ctrl+C and wait for the subtitles to be copied to your
                                        clipboard.
                                    </p>
                                </div>
                                <div className="border-l-4 border-blue-500 pl-6">
                                    <h3 className="text-xl font-medium mb-2">
                                        4. Paste to Bun
                                    </h3>
                                    <p className="text-gray-700">
                                        Return to the <a href="https://japanese-memory-rsc.vercel.app/latest" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline">Bun app</a> and paste the content into
                                        the input box at the bottom.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 mt-8">
                            When reviewing, you can click the <button 
                                onClick={() => {
                                    const demoCard = document.querySelector('.mt-14');
                                    if (demoCard) {
                                        demoCard.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'center'
                                        });
                                        
                                        const clickMe = document.createElement('div');
                                        clickMe.className = 'absolute -top-10 right-0 text-blue-500 font-medium animate-fadeInOut';
                                        clickMe.textContent = 'Click me!';
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
                            >button</button> in the top-right corner of each card to instantly return to the source context and pronunciation of the sentence. This feature helps you better understand how the sentence is used in its original context and ensures you're practicing with accurate pronunciation.
                        </p>
                        <p className="text-gray-700 mt-12 flex items-center gap-2">
                            I personally recommend 
                            <span className="flex items-center group">
                                <a href="https://www.youtube.com/@marymarymary80s" target="_blank" rel="noopener noreferrer">
                                    <img src="https://yt3.googleusercontent.com/x4eKHmgtnTU3xjqL3uP7sSJadSbaBIJL0g0T-dxo6veLCixHLxvg_4d8g9iF4Bcom1evobHjAg=s160-c-k-c0x00ffffff-no-rj" 
                                        alt="Mary's channel avatar"
                                        className="w-[30px] h-[30px] rounded-full"
                                    />
                                </a>
                                <a href="https://www.youtube.com/@marymarymary80s" target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:text-blue-700 group-hover:underline">Mary's YouTube Channel</a>
                            </span>. Here's why:
                        </p>
                        <ul className="space-y-3 text-gray-700 mt-4">
                            <li>• Perfect sentence breaks with built-in subtitles</li>
                            <li>• Seamless shadowing experience when used with my extension and app</li>
                            <li>• Modern, practical Japanese that you can use in daily life</li>
                            <li>• Engaging content that makes learning enjoyable</li>
                        </ul>
                        <p className="text-gray-700 mt-8">
                            Of course, if you prefer anime, you can find Japanese anime with Japanese subtitles on Netflix. 
                            Netflix's subtitle feature provides natural sentence breaks that align perfectly with the workflow of Bun.
                        </p>
                    </div>
                </Card>

                {/* What If I Can't Remember Section */}
                <Card className="mb-8 bg-white border-none shadow-none">
                    <h2 className="text-2xl font-semibold text-center mb-12">
                        What If I Can't Remember What I've Learned?
                    </h2>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-gray-700 mb-6">
                            First of all, forgetting is completely normal. Everyone forgets a significant proportion of what they learn - it's how our brains work.
                        </p>
                        
                        <p className="text-gray-700 mb-6">
                            The key is to be selective: only input sentences that you find interesting or important. If you genuinely find something interesting or important, you'll naturally be more willing to invest time in:
                        </p>
                        
                        <ul className="space-y-3 text-gray-700 mt-4 mb-6">
                            <li>• Shadow reading</li>
                            <li>• Dictation practice</li>
                            <li>• Recalling sentences from key vocabulary words</li>
                            <li>• Taking tests</li>
                            <li>• Reviewing your daily learning reports</li>
                        </ul>
                        
                        <p className="text-gray-700">
                            When you engage with the material in these multiple ways, you'll find that you can remember a substantial portion of what you've learned. The Bun system is designed to support this multi-faceted approach to learning, making retention much more effective than traditional methods.
                        </p>
                    </div>
                </Card>

                {/* Summary Section */}
                <Card className="p-8 bg-white border-none shadow-none">
                    <h2 className="text-2xl font-semibold text-center mb-12">
                        Why Bun?
                    </h2>
                    <div className="max-w-3xl mx-auto">
                        <div className="text-gray-700 space-y-6">
                            <div className="mb-8">
                                <h3 className="text-xl font-medium mb-3">Built by a Real Language Learner</h3>
                                <p className="leading-relaxed">
                                    Bun is created by a developer who is actively learning Japanese and living in Japan. This means the app is designed with real understanding of language learning challenges and needs.
                                </p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-medium mb-3">Serious Learning System</h3>
                                <p className="leading-relaxed">
                                    Unlike many language apps that focus on gamification and entertainment, Bun is a serious learning tool built on solid pedagogical principles and effective learning methodologies.
                                </p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-medium mb-3">Clear and Efficient Workflow</h3>
                                <p className="leading-relaxed">
                                    We've designed a uniquely streamlined learning process that eliminates unnecessary complexity. Every feature serves a clear purpose in your language learning journey.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 max-w-3xl mx-auto">
                        Have fun exploring <a href="https://japanese-memory-rsc.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline">Bun</a>!
                    </div>
                </Card>
            </div>
        </div>
    );
};
export default App;
