import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { useState } from 'react';
import { Exam } from './exam-preparation';
import { useTranslations } from 'next-intl';

export function ExamItem({ exam }: { exam: Exam }) {
    const [hovered, setHovered] = useState(false);
    const router = useRouter();
    let isLocked = false;
    const t = useTranslations('exam');

    function handleClick() {
        if (isLocked) return;
        const query = new URLSearchParams({ id: exam.id }).toString();
        router.push(`/exam?${query}`);
        isLocked = true;
    }

    return (
        <li
            key={exam.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer ${hovered ? 'dark:bg-darkButtonBg bg-[#f3f4f6] dark:text-[black]' : ''}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleClick}
        >
            <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-[#999]-500" />
                <span>{exam.date}</span>
            </div>
            <div className="flex items-center space-x-2">
                <span>{t('score')}: {exam.score}</span>
                <Tooltip>
                    <TooltipTrigger>
                        <ClockIcon
                            style={{ color: hovered ? "black" : "" }}
                            className="h-4 w-4 text-[#999]"
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('duration')}: {exam.duration} {t('minutes')}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </li>
    )
}