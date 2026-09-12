import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';
import { usePageTitle } from '../hooks/usePageTitle';
import pageStyles from '../styles/page.module.css';
import styles from './Dashboard.module.css';

const STAT_CARDS = [
  { label: '전체 할 일', key: 'numOfTask' as const, done: false },
  { label: '남은 할 일', key: 'numOfRestTask' as const, done: false },
  { label: '완료한 일', key: 'numOfDoneTask' as const, done: true },
];

export function Dashboard() {
  usePageTitle('대시보드');

  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getDashboard,
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>대시보드</h1>

      {isError ? (
        <p className={pageStyles.errorText}>데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>
      ) : (
        <div className={styles.cards}>
          {STAT_CARDS.map(({ label, key, done }) => (
            <div key={key} className={styles.card}>
              <span className={styles.cardLabel}>{label}</span>
              {isPending ? (
                <span className={`${styles.skeleton} ${styles.skeletonValue}`} />
              ) : (
                <span className={`${styles.cardValue} ${done ? styles.done : ''}`}>
                  {data?.[key] ?? 0}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
