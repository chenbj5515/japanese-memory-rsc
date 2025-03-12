import { Loader2, CheckCircle, XCircle, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input"
import { ExamInfo } from ".";
import { useTranslations } from "next-intl";

interface QuestionProps {
    disabled: boolean;
    placeholder: string;
    inputInfo: ExamInfo;
    onChange: (val: string) => void;
    onFixClick?: () => void;
}

export function QuestionInput({
    inputInfo,
    disabled,
    placeholder,
    onChange,
    onFixClick
}: QuestionProps) {
    const { reference_answer, is_correct, no, user_answer } = inputInfo;
    const t = useTranslations('exam');
    
    return (
        <div className="mt-2">
            <Input
                id={no.toString()}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
                value={user_answer}
                onChange={(e) => onChange(e.target.value)}
            />
            {
                inputInfo.judging ? (
                    <Loader2 className="h-4 w-4 mt-2 animate-spin" />
                ) : null
            }
            {
                inputInfo.completed ? (
                    <div className="mt-2 flex items-center">
                        {is_correct ? (
                            <CheckCircle color="#32CD32" className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                            <XCircle color="#E50914" className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="text-sm">
                            {is_correct ? t('correct') : t('reference_answer', { answer: reference_answer })}
                        </span>
                        {
                            user_answer && onFixClick && (
                                <Wrench
                                    className="cursor-pointer text-[#999]-500 hover:text-yellow-500 ml-4"
                                    size={20}
                                    onClick={onFixClick}
                                />
                            )
                        }
                    </div>
                ) : null
            }
        </div>
    )
}