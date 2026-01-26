import styles from '../styles/TimerDisplay.module.css';
import { formatTime } from '../utils/timeFormatter';
import { TIMER_MODE } from '../constants';

const TimerDisplay = ({ timeLeft, mode }) => {
    const isStudy = mode === TIMER_MODE.STUDY;

    return (
        <div className={styles.container}>
            <div className={`${styles.mode} ${isStudy ? styles.study : styles.break}`}>
                {isStudy ? 'Focus Time' : 'Break Time'}
            </div>
            <div className={styles.time} role="timer" aria-live="polite">
                {formatTime(timeLeft)}
            </div>
        </div>
    );
};

export default TimerDisplay;
