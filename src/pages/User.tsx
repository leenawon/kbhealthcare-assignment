import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/user';
import styles from './User.module.css';

export function User() {
  const { data, isPending } = useQuery({
    queryKey: ['user'],
    queryFn: userApi.getUser,
  });

  const renderContent = () => {
    if (isPending) {
      return (
        <div className={styles.card}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>이름</span>
            <span className={`${styles.skeleton} ${styles.skeletonName}`} />
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>메모</span>
            <span className={`${styles.skeleton} ${styles.skeletonMemo}`} />
          </div>
        </div>
      );
    }

    return (
      <div className={styles.card}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>이름</span>
          <span className={styles.fieldValue}>{data?.name}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>메모</span>
          <span className={styles.fieldValue}>{data?.memo}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>회원정보</h1>
      {renderContent()}
    </div>
  );
}
