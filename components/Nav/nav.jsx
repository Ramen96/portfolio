"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './nav.module.css';

export default function Nav({ navItems }) {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? styles.navButtonActive : '';
  }

  const handleNavClick = (e) => {
    console.log('Nav click event:', {
      target: e.target,
      href: e.target.href,
      eventType: e.type
    });
  };

  return (
    <nav className={styles.nav} onClick={handleNavClick}>
      {navItems.map(item => (
        <Link
          key={item.name}
          href={item.href}
          className={`${styles.navButton} ${isActive(item.href)}`}
          onClick={(e) => {
            console.log('Link click event:', {
              name: item.name,
              href: item.href,
              eventType: e.type
            });
          }}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}