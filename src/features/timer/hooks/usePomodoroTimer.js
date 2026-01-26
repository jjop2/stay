import { useState, useEffect, useRef, useCallback } from 'react';
import { TIMER_CONSTANTS, TIMER_MODE } from '../constants';
import { useAudioAlert } from './useAudioAlert';

/**
 * 뽀모도로 타이머 로직을 관리하는 메인 커스텀 훅
 * 
 * 주요 기능:
 * - 타이머 상태 관리 (남은 시간, 현재 모드, 실행 여부)
 * - 50분 공부 / 10분 휴식 모드 자동 전환
 * - 시간 종료 시 알림(브라우저 알림 & 소리) 트리거
 */
export const usePomodoroTimer = () => {
    const [timeLeft, setTimeLeft] = useState(TIMER_CONSTANTS.STUDY_TIME);
    const [mode, setMode] = useState(TIMER_MODE.STUDY);
    const [isRunning, setIsRunning] = useState(false);
    const [isActive, setIsActive] = useState(false); // 중지 버튼 활성화/비활성화 제어

    const timerRef = useRef(null);
    const { volume, setVolume, isMuted, setIsMuted, playAlert } = useAudioAlert();

    // 최초 시작 시 브라우저 알림 권한 요청
    const requestNotificationPermission = async () => {
        if (Notification.permission !== 'granted') {
            await Notification.requestPermission();
        }
    };

    const notifyUser = useCallback((message) => {
        // 소리 알림 재생
        playAlert();

        // 브라우저 알림 표시
        if (Notification.permission === 'granted') {
            new Notification('Stay Timer', {
                body: message,
                icon: '/favicon.png',
                badge: '/favicon.png',
                requireInteraction: true,
            });
        }
    }, [playAlert]);

    const switchMode = useCallback(() => {
        if (mode === TIMER_MODE.STUDY) {
            setMode(TIMER_MODE.BREAK);
            setTimeLeft(TIMER_CONSTANTS.BREAK_TIME);
            notifyUser('공부 시간이 끝났습니다. 10분간 휴식하세요!');
        } else {
            setMode(TIMER_MODE.STUDY);
            setTimeLeft(TIMER_CONSTANTS.STUDY_TIME);
            notifyUser('쉬는 시간이 끝났습니다. 다시 공부하세요.');
        }
    }, [mode, notifyUser]);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // 타이머 종료 (0초 도달)
            switchMode();
        }

        return () => clearInterval(timerRef.current);
    }, [isRunning, timeLeft, switchMode]);

    const toggleTimer = async () => {
        if (!isRunning && !isActive) {
            // 타이머를 처음 시작할 때 권한 요청
            await requestNotificationPermission();
            setIsActive(true);
        }
        setIsRunning((prev) => !prev);
    };

    const stopTimer = () => {
        setIsRunning(false);
        setIsActive(false);
        setMode(TIMER_MODE.STUDY);
        setTimeLeft(TIMER_CONSTANTS.STUDY_TIME);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    return {
        timeLeft,
        mode,
        isRunning,
        isActive,
        toggleTimer,
        stopTimer,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
    };
};
