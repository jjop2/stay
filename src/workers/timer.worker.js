/* eslint-disable no-restricted-globals */

/**
 * 타이머 로직을 처리하는 웹 워커
 * 
 * 메인 스레드(React)와 별도로 동작하여, 
 * 브라우저 탭이 비활성화되거나 백그라운드 상태일 때도 
 * 정확한 시간을 유지하기 위해 사용됩니다.
 */

let intervalId = null;

self.onmessage = (e) => {
    const { command, time, mode } = e.data;

    switch (command) {
        case 'START':
            if (intervalId) return; // 이미 실행 중이면 무시

            let timeLeft = time;

            intervalId = setInterval(() => {
                timeLeft -= 1;
                self.postMessage({ type: 'TICK', timeLeft });

                if (timeLeft <= 0) {
                    clearInterval(intervalId);
                    intervalId = null;
                    self.postMessage({ type: 'COMPLETE' });
                }
            }, 1000);
            break;

        case 'PAUSE':
        case 'STOP':
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            break;

        default:
            break;
    }
};
