import styles from '../styles/TimerControls.module.css';

const TimerControls = ({ isRunning, isActive, onToggle, onStop }) => {
    const buttonFont = "'Noto Sans KR', 'Quicksand', sans-serif";

    return (
        <div className={styles.container}>
            <button
                className={`${styles.button} ${isRunning ? styles.pause : styles.start} `}
                onClick={onToggle}
                style={{ fontFamily: buttonFont }}
            >
                {isRunning ? '일시정지' : (isActive ? '계속하기' : '시작')}
            </button>

            <button
                className={`${styles.button} ${styles.stop} `}
                onClick={onStop}
                disabled={!isActive}
                aria-label="Stop Timer"
                style={{ fontFamily: buttonFont }}
            >
                중지
            </button>
        </div>
    );
};

export default TimerControls;
