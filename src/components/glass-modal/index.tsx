// 通用的毛玻璃Modal组件
import { useEffect } from 'react';

interface GlassModalProps {
    open: boolean;
    containerRef: React.RefObject<HTMLDivElement>;
    children: React.ReactNode;
}

export function GlassModal({ open, containerRef, children }: GlassModalProps) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed w-[100%] h-[100vh] left-0 top-0 backdrop-blur-[3px] backdrop-saturate-[180%] overflow-scroll z-[10000]">
            <div
                ref={containerRef}
                className="sm:w-auto sm:min-w-[40vw] w-full p-[15px] pt-[22px] absolute max-h-[85%] overflow-auto left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]"
            >
                {children}
            </div>
        </div>
    );
}