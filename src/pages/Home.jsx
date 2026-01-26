import { usePomodoroTimer } from '@/features/timer/hooks/usePomodoroTimer';
import TimerDisplay from '@/features/timer/components/TimerDisplay';
import TimerControls from '@/features/timer/components/TimerControls';
import VolumeControl from '@/features/timer/components/VolumeControl';
import Footer from '@/components/Layout/Footer';
import styles from './Home.module.css';

const Home = () => {
    const {
        timeLeft, mode, isRunning, isActive, toggleTimer, stopTimer,
        volume, setVolume, isMuted, setIsMuted
    } = usePomodoroTimer();

    return (
        <div className={styles.container}>
            <main className={styles.content}>
                <h1 className={styles.title}>Stay</h1>
                <div className={styles.card}>
                    <TimerDisplay timeLeft={timeLeft} mode={mode} />
                    <TimerControls
                        isRunning={isRunning}
                        isActive={isActive}
                        onToggle={toggleTimer}
                        onStop={stopTimer}
                    />
                    <VolumeControl
                        volume={volume}
                        onVolumeChange={setVolume}
                        isMuted={isMuted}
                        onMuteToggle={() => setIsMuted(prev => !prev)}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
