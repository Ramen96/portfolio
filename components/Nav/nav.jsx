"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './nav.module.css';

export default function Nav({ navItems }) {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? styles.navButtonActive : '';
  }

  // clicks are not working
  // check page.jsx for the / route to see if the cursor effect has something to do with this.
  return (
    <nav className={styles.nav}>
      {navItems.map(item => (
        <Link
          key={item.name}
          href={item.href}
          className={`${styles.navButton} ${isActive(item.href)}`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}