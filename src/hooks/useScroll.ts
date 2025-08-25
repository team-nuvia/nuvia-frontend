import { RefObject, useEffect, useRef, useState } from 'react';

type UseScrollOptions = {
  /** 스크롤 컨테이너 ref (없으면 window 기준) */
  targetRef?: RefObject<HTMLElement | null>;
  /** progress 계산 단위: 'y' | 'x' */
  axis?: 'y' | 'x';
  /** progress를 퍼센트(0~100)로 반환할지 (기본 true) */
  percent?: boolean;
};

export type ScrollState = {
  x: number;
  y: number;
  progress: number; // 0~100 (percent=true) 또는 0~1
  direction: 'up' | 'down' | 'left' | 'right' | 'none';
  atTop: boolean;
  atBottom: boolean;
};

export function useScroll(options: UseScrollOptions = {}): ScrollState {
  const { targetRef, axis = 'y', percent = true } = options;
  let requestNumber: number;
  const [state, setState] = useState<ScrollState>({
    x: 0,
    y: 0,
    progress: 0,
    direction: 'none',
    atTop: true,
    atBottom: false,
  });

  const ticking = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const sizeRef = useRef({ scrollW: 1, scrollH: 1, clientW: 1, clientH: 1 });

  // 전체 길이 재계산
  const recalc = () => {
    if (typeof window === 'undefined') return;

    const el = targetRef?.current;
    if (el) {
      sizeRef.current.scrollW = el.scrollWidth;
      sizeRef.current.scrollH = el.scrollHeight;
      sizeRef.current.clientW = el.clientWidth;
      sizeRef.current.clientH = el.clientHeight;
    } else {
      const doc = document.documentElement;
      sizeRef.current.scrollW = doc.scrollWidth;
      sizeRef.current.scrollH = doc.scrollHeight;
      sizeRef.current.clientW = window.innerWidth;
      sizeRef.current.clientH = window.innerHeight;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const el = targetRef?.current;
    const scrollTarget: HTMLElement | Window = el ?? window;

    const measure = () => {
      // 현재 스크롤 위치
      const x = el ? el.scrollLeft : window.scrollX;
      const y = el ? el.scrollTop : window.scrollY;

      const { scrollW, scrollH, clientW, clientH } = sizeRef.current;

      const maxX = Math.max(1, scrollW - clientW);
      const maxY = Math.max(1, scrollH - clientH);

      const progressRaw = axis === 'y' ? y / maxY : x / maxX;
      const progress = percent ? Math.min(100, Math.max(0, progressRaw * 100)) : Math.min(1, Math.max(0, progressRaw));

      // 방향
      let direction: ScrollState['direction'] = 'none';
      if (axis === 'y') {
        if (y > lastY.current) direction = 'down';
        else if (y < lastY.current) direction = 'up';
      } else {
        if (x > lastX.current) direction = 'right';
        else if (x < lastX.current) direction = 'left';
      }

      const atTop = y <= 0;
      const atBottom = y >= maxY - 1; // 오프바이원 여유

      lastX.current = x;
      lastY.current = y;

      setState({
        x,
        y,
        progress,
        direction,
        atTop,
        atBottom,
      });

      ticking.current = false;
    };

    const onScroll = () => {
      // rAF 스로틀
      if (!ticking.current) {
        ticking.current = true;
        requestNumber = window.requestAnimationFrame(measure);
      }
    };

    // 최초 치수 계산 & 최초 측정
    recalc();
    onScroll();

    // 리스너 등록 (패시브)
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalc, { passive: true });

    // ResizeObserver(지원 시)
    let ro: ResizeObserver | null = null;
    try {
      ro = new ResizeObserver(() => {
        recalc();
        onScroll();
      });
      ro.observe(el ?? document.documentElement);
    } catch {
      // 환경에 따라 미지원 가능
    }

    return () => {
      scrollTarget.removeEventListener('scroll', onScroll as any);
      window.removeEventListener('resize', recalc as any);
      ro?.disconnect();
      window.cancelAnimationFrame(requestNumber);
    };
    // targetRef.current가 바뀌면 다시 바인딩
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRef, axis, percent]);

  return state;
}
