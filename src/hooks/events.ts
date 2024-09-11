import { useRef } from 'react';

export function useTripleClick(callback: () => void, delay: number = 500) {
  const clickCountRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleClick = () => {
    clickCountRef.current += 1;

    if (clickCountRef.current === 3) {
      callback();  // 执行传入的回调函数
      clickCountRef.current = 0;  // 重置点击计数
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    if (!timerRef.current) {
      timerRef.current = window.setTimeout(() => {
        clickCountRef.current = 0;
        timerRef.current = null;
      }, delay);  // 超过 delay 时间后重置点击计数
    }
  };

  const setRef = (element: HTMLElement | null) => {
    if (element) {
      element.addEventListener('click', handleClick);
    } else if (elementRef.current) {
      elementRef.current.removeEventListener('click', handleClick);
    }
    elementRef.current = element;
  };

  return setRef;
}

export default useTripleClick;
