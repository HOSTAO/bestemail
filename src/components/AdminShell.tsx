'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './AdminShell.module.css';

type NavItem = {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
  badge?: string;
};

type AdminShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  nav: NavItem[];
  actions?: ReactNode;
  sidebarExtra?: ReactNode;
  children: ReactNode;
};

const workflow = [
  { label: 'Login', note: 'Secure access' },
  { label: 'Settings', note: 'Delivery + config' },
  { label: 'Contacts', note: 'Bring audience in' },
  { label: 'Campaigns', note: 'Draft and send' },
  { label: 'Forms', note: 'Capture new leads' },
];

export default function AdminShell({
  eyebrow = 'Bestemail Admin',
  title,
  description,
  nav,
  actions,
  sidebarExtra,
  children,
}: AdminShellProps) {
  const activeIndex = Math.max(1, nav.findIndex((item) => item.active) + 1);

  return (
    <div className={styles.shell}>
      <div className={styles.frame}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <div className={styles.logo}>B</div>
            <div>
              <p className={styles.eyebrow}>{eyebrow}</p>
              <h1 className={styles.brandTitle}>Control Center</h1>
            </div>
          </div>

          <div className={styles.workflowCard}>
            <div className={styles.workflowTitle}>Founder workflow</div>
            <div className={styles.workflowList}>
              {workflow.map((step, index) => {
                const complete = index < activeIndex;
                const current = index === activeIndex;
                return (
                  <div key={step.label} className={styles.workflowItem}>
                    <div className={`${styles.workflowDot} ${complete ? styles.workflowDotComplete : ''} ${current ? styles.workflowDotCurrent : ''}`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className={styles.workflowLabel}>{step.label}</div>
                      <div className={styles.workflowNote}>{step.note}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <nav className={styles.nav}>
            {nav.map((item) => {
              const itemClass = item.active
                ? `${styles.navItem} ${styles.navItemActive}`
                : styles.navItem;
              const badgeClass = item.active
                ? `${styles.badge} ${styles.badgeActive}`
                : styles.badge;

              return (
                <Link key={item.href} href={item.href} className={itemClass}>
                  <span className={styles.navLabel}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  {item.badge ? <span className={badgeClass}>{item.badge}</span> : null}
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarCard}>
            <strong>Admin focus</strong>
            <div>Use the product in this order: settings first, then contacts, then campaigns. Forms come after the core sending flow is working.</div>
          </div>

          {sidebarExtra ? <div>{sidebarExtra}</div> : null}
        </aside>

        <div className={styles.main}>
          <header className={styles.header}>
            <div className={styles.headerRow}>
              <div>
                <p className={styles.eyebrow}>{eyebrow}</p>
                <h2 className={styles.title}>{title}</h2>
                {description ? <p className={styles.description}>{description}</p> : null}
              </div>
              {actions ? <div className={styles.actions}>{actions}</div> : null}
            </div>
            <div className={styles.mobileNav}>
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className={`${styles.mobileNavItem} ${item.active ? styles.mobileNavItemActive : ''}`}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </header>

          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </div>
  );
}
