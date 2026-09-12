import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { taskApi } from '../api/task';
import { usePageTitle } from '../hooks/usePageTitle';
import pageStyles from '../styles/page.module.css';
import styles from './TaskList.module.css';

export function TaskList() {
  usePageTitle('할 일');

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');

  const { data, isPending, isError } = useQuery({
    queryKey: ['tasks', page],
    queryFn: () => taskApi.getTasks(page),
  });

  const goToPage = (next: number) => {
    setSearchParams({ page: String(next) });
  };

  const renderList = () => {
    if (isPending) {
      return (
        <div className={styles.list}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`${styles.card} ${styles.skeletonCard}`}>
              <span className={styles.skeletonTitle} />
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return <p className={pageStyles.errorText}>데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>;
    }

    if (data?.data.length === 0) {
      return <p className={styles.empty}>등록된 할 일이 없습니다.</p>;
    }

    return (
      <div className={styles.list}>
        {data?.data.map((task) => (
          <Link
            key={task.id}
            to={`/task/${task.id}`}
            className={styles.card}
          >
            <span className={styles.cardTitle}>{task.title}</span>
            <span className={styles.cardMemo}>{task.memo}</span>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>할 일</h1>

      {renderList()}

      {data && data.data.length > 0 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
          >
            이전
          </button>
          <span className={styles.pageInfo}>{page} 페이지</span>
          <button
            className={styles.pageButton}
            onClick={() => goToPage(page + 1)}
            disabled={!data.hasNext}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
