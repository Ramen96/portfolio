"use client";
import Link from 'next/link';
import styles from './nav.module.css';

export default function Nav({ navItems, currentSection, setCurrentSection}) {
  const isActive = (sectionName) => currentSection === sectionName ? styles.navButtonActive : '';

  return (
    <nav className={styles.nav}>
      {navItems.map(item =>
        item.href === '#' ?
          (
            <Link
              key={item.name}
              className={`${styles.navButton} ${isActive(item.name)}`}
              href={'#'}
              onClick={() => setCurrentSection(item.name)}
            >
              {item.name}
            </Link>
          )
          :
          (
            <Link
              key={item.name}
              className={`${styles.navButton} ${isActive(item.name)}`}
              href={item.href}
            >
              {item.name}
            </Link>
          )
      )}
    </nav>
  );
}