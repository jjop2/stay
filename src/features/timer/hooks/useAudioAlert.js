import { useState, useRef, useCallback } from 'react';

/**
 * Web Audio API를 사용하여 알림음을 재생하고 오디오 설정을 관리하는 커스텀 훅
 * 
 * 주요 기능:
 * - Oscillator를 사용한 비프음 생성 (외부 파일 불필요)
 * - GainNode를 사용한 볼륨 조절 (0.0 ~ 1.0)
 * - 음소거 토글 상태 관리
 */
export const useAudioAlert = () => {
    const [volume, setVolume] = useState(0.5); // 볼륨 범위: 0.0 ~ 1.0
    const [isMuted, setIsMuted] = useState(false);
    const audioCtxRef = useRef(null);

    const playAlert = useCallback(() => {
        if (isMuted || volume === 0) return;

        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;

        // 브라우저 정책으로 인해 중단된 오디오 컨텍스트 재개
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'sine';
        // "띠링!" 소리: 높은 음에서 시작해(880Hz) 빠르게 떨어짐(440Hz)
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.6);

        const effectiveVolume = isMuted ? 0 : volume;
        gainNode.gain.setValueAtTime(effectiveVolume, ctx.currentTime);
        // 소리가 부드럽게 사라지도록 처리 (페이드 아웃)
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.6);
    }, [volume, isMuted]);

    return { volume, setVolume, isMuted, setIsMuted, playAlert };
};
