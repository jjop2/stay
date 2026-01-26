import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>
                &copy; {new Date().getFullYear()} Stay. Created by{' '}
                <a
                    href="https://github.com/jjop2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    @jjop2
                </a>
            </p>
        </footer>
    );
};

export default Footer;
