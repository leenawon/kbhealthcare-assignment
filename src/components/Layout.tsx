import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, UserCircle, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import styles from './Layout.module.css';

export function Layout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <LayoutDashboard size={20} />
          <span>대시보드</span>
        </NavLink>

        <NavLink
          to="/task"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <CheckSquare size={20} />
          <span>할 일</span>
        </NavLink>

        {isAuthenticated ? (
          <NavLink
            to="/user"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <UserCircle size={20} />
            <span>회원정보</span>
          </NavLink>
        ) : (
          <NavLink
            to="/sign-in"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <LogIn size={20} />
            <span>로그인</span>
          </NavLink>
        )}
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
