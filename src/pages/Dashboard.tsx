import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard";
import styles from "./Dashboard.module.css";

const STAT_CARDS = [
  { label: '전체 할 일', key: 'numOfTask' as const, done: false },
  { label: '남은 할 일', key: 'numOfRestTask' as const, done: false },
  { label: '완료한 일', key: 'numOfDoneTask' as const, done: true },
];

export function Dashboard() {
  const { data, isPending } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getDashboard,
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>대시보드</h1>

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
    </div>
  );
}
