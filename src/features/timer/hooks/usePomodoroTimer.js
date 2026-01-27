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

    const timerWorkerRef = useRef(null);
    const { volume, setVolume, isMuted, setIsMuted, playAlert } = useAudioAlert();

    // 최초 시작 시 브라우저 알림 권한 요청
    const requestNotificationPermission = async () => {
        if (typeof Notification === 'undefined') return; // 브라우저가 알림을 지원하지 않는 경우

        try {
            if (Notification.permission !== 'granted') {
                await Notification.requestPermission();
            }
        } catch (error) {
            console.warn('Notification permission request failed:', error);
            // 알림 권한 실패해도 타이머는 코어 기능이므로 계속 진행
        }
    };

    const notifyUser = useCallback(async (message) => {
        // 소리 알림 재생
        playAlert();

        // 브라우저 알림 표시
        if (Notification.permission === 'granted') {
            try {
                // 모바일 지원을 위해 Service Worker를 통한 알림 우선 시도
                const registration = await navigator.serviceWorker.ready;
                if (registration && 'showNotification' in registration) {
                    await registration.showNotification('Stay Timer', {
                        body: message,
                        icon: '/favicon.png',
                        badge: '/favicon.png',
                        requireInteraction: true,
                        vibrate: [200, 100, 200], // 모바일 진동 추가
                    });
                    return;
                }
            } catch (error) {
                console.log('Service Worker notification failed, falling back to standard API', error);
            }

            // Fallback: 표준 Notification API
            new Notification('Stay Timer', {
                body: message,
                icon: '/favicon.png',
                badge: '/favicon.png',
                requireInteraction: true,
                vibrate: [200, 100, 200], // 모바일 진동 추가
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

    // switchMode가 변경되면 ref 업데이트 (Worker callback에서 최신값 사용 위함)
    const switchModeRef = useRef(switchMode);
    useEffect(() => {
        switchModeRef.current = switchMode;
    }, [switchMode]);

    useEffect(() => {
        // Web Worker 초기화
        timerWorkerRef.current = new Worker(new URL('../../../workers/timer.worker.js', import.meta.url));

        timerWorkerRef.current.onmessage = (e) => {
            const { type, timeLeft: workerTimeLeft } = e.data;
            if (type === 'TICK') {
                setTimeLeft(workerTimeLeft);
            } else if (type === 'COMPLETE') {
                if (switchModeRef.current) {
                    switchModeRef.current();
                }
            }
        };

        return () => {
            if (timerWorkerRef.current) timerWorkerRef.current.terminate();
        };
    }, []); // 의존성 제거: Worker는 한 번만 생성됨

    useEffect(() => {
        if (isRunning) {
            timerWorkerRef.current.postMessage({ command: 'START', time: timeLeft });
        } else {
            timerWorkerRef.current.postMessage({ command: 'PAUSE' });
        }
    }, [isRunning, mode]); // 모드 변경 시 시간 리셋하여 재시작

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
        timerWorkerRef.current.postMessage({ command: 'STOP' });
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
