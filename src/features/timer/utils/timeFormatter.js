/**
 * 초 단위의 시간을 받아 'MM:SS' 형식의 문자열로 변환하는 유틸리티 함수
 * 예: 65 -> "01:05"
 * 
 * @param {number} seconds - 초 단위 시간
 * @returns {string} MM:SS 포맷의 문자열
 */
export const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};
