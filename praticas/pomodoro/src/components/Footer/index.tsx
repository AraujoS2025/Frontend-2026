import styles from './styles.module.css';
import { RouterLink } from '../RouterLink';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <RouterLink href='/about-pomodoro/'>
        Veja como funciona o pomodoro
      </RouterLink>
      <RouterLink href='/'>
        Pomodoro &copy; {new Date().getFullYear()} - Feito por Alex Ariel
      </RouterLink>
    </footer>
  );
}
