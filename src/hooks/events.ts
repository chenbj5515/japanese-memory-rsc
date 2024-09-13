import { useRef, useEffect } from 'react';

export function useLongPress(callback: () => void, delay: number = 2000) {
  const timerRef = useRef<number | null>(null);
  const elementRef = useRef<any>(null);

  const handleMouseDown = () => {
    // 开始长按，启动定时器
    timerRef.current = window.setTimeout(() => {
      callback();  // 触发长按事件
      timerRef.current = null;  // 重置计时器
    }, delay);
  };

  const handleMouseUp = () => {
    // 松开按钮，取消定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // const setRef = (element: HTMLElement | null) => {
  //   if (element) {
  //     element.addEventListener('mousedown', handleMouseDown);
  //     element.addEventListener('mouseup', handleMouseUp);
  //     element.addEventListener('mouseleave', handleMouseUp); // 处理鼠标移出元素的情况
  //   } else if (elementRef.current) {
  //     elementRef.current.removeEventListener('mousedown', handleMouseDown);
  //     elementRef.current.removeEventListener('mouseup', handleMouseUp);
  //     elementRef.current.removeEventListener('mouseleave', handleMouseUp);
  //   }
  //   elementRef.current = element;
  // };
  
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.addEventListener('mousedown', handleMouseDown);
      elementRef.current.addEventListener('mouseup', handleMouseUp);
      elementRef.current.addEventListener('mouseleave', handleMouseUp);
    }
    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('mousedown', handleMouseDown);
        elementRef.current.removeEventListener('mouseup', handleMouseUp);
        elementRef.current.removeEventListener('mouseleave', handleMouseUp);
      }
    }
  }, [])

  return elementRef;
}

export default useLongPress;
