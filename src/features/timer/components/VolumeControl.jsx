import styles from '../styles/VolumeControl.module.css';

const VolumeControl = ({ volume, onVolumeChange, isMuted, onMuteToggle }) => {
    return (
        <div className={styles.container}>
            <button
                className={styles.muteButton}
                onClick={onMuteToggle}
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted || volume === 0 ? '🔇' : '🔊'}
            </button>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className={styles.slider}
                disabled={isMuted}
                aria-label="Volume Control"
            />
        </div>
    );
};

export default VolumeControl;
