import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getDashboard,
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>대시보드</h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>전체 할 일</span>
          {isLoading ? (
            <span className={`${styles.skeleton} ${styles.skeletonValue}`} />
          ) : (
            <span className={styles.cardValue}>{data?.numOfTask ?? 0}</span>
          )}
        </div>

        <div className={styles.card}>
          <span className={styles.cardLabel}>남은 할 일</span>
          {isLoading ? (
            <span className={`${styles.skeleton} ${styles.skeletonValue}`} />
          ) : (
            <span className={styles.cardValue}>{data?.numOfRestTask ?? 0}</span>
          )}
        </div>

        <div className={styles.card}>
          <span className={styles.cardLabel}>완료한 일</span>
          {isLoading ? (
            <span className={`${styles.skeleton} ${styles.skeletonValue}`} />
          ) : (
            <span className={`${styles.cardValue} ${styles.done}`}>
              {data?.numOfDoneTask ?? 0}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
