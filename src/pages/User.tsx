import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/user';
import { usePageTitle } from '../hooks/usePageTitle';
import pageStyles from '../styles/page.module.css';
import styles from './User.module.css';

export function User() {
  usePageTitle('회원정보');

  const { data, isPending, isError } = useQuery({
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

    if (isError) {
      return <p className={pageStyles.errorText}>데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>;
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
