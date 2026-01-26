import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>
                &copy; {new Date().getFullYear()} Stay. Created by{' '}
                <a
                    href="https://github.com/your-username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    Suhyeon Jang
                </a>
            </p>
        </footer>
    );
};

export default Footer;
