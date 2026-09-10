import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskApi } from '../api/task';
import { ApiError } from '../api/client';
import { Modal } from '../components/Modal';
import styles from './TaskDetail.module.css';

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmId, setConfirmId] = useState('');

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['task', id],
    queryFn: () => taskApi.getTask(id!),
  });

  const { mutate: deleteTask, isPending: isDeletePending } = useMutation({
    mutationFn: () => taskApi.deleteTask(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/task');
    },
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setConfirmId('');
  };

  if (isPending) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.skeletonHeading} />
        </div>
        <div className={styles.card}>
          <div className={styles.field}>
            <div className={styles.skeletonLabel} />
            <div className={styles.skeletonValue} />
          </div>
        </div>
      </div>
    );
  }

  if (isError && error instanceof ApiError && error.status === 404) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>존재하지 않는 할 일입니다.</p>
          <p className={styles.emptyDescription}>삭제되었거나 잘못된 경로입니다.</p>
          <Link to="/task" className={styles.backButton}>목록으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  const deleteModalFooter = (
    <>
      <button className={styles.cancelButton} onClick={handleCloseModal}>
        취소
      </button>
      <button
        className={styles.confirmButton}
        disabled={confirmId !== id || isDeletePending}
        onClick={() => deleteTask()}
      >
        {isDeletePending ? '삭제 중...' : '삭제'}
      </button>
    </>
  );

  return (
    <div className={styles.container}>
      <Link to="/task" className={styles.backLink}>← 목록으로</Link>

      <div className={styles.header}>
        <h1 className={styles.heading}>할 일 상세</h1>
        <button className={styles.deleteButton} onClick={() => setIsModalOpen(true)}>
          삭제
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>제목</span>
          <span className={styles.fieldValue}>{data?.title}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>메모</span>
          <span className={styles.fieldValue}>{data?.memo}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>등록일시</span>
          <span className={styles.fieldValue}>
            {data?.registerDatetime
              ? new Date(data.registerDatetime).toLocaleString('ko-KR')
              : '-'}
          </span>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="할 일 삭제"
        footer={deleteModalFooter}
      >
        <div className={styles.modalBody}>
          <p className={styles.modalDescription}>
            이 작업은 되돌릴 수 없습니다. 삭제하려면 아래에 할 일 ID를 입력하세요.
          </p>
          <div className={styles.modalField}>
            <label htmlFor="confirm-id" className={styles.modalLabel}>
              할 일 ID: <strong>{id}</strong>
            </label>
            <input
              id="confirm-id"
              type="text"
              className={styles.modalInput}
              placeholder="ID를 입력하세요"
              value={confirmId}
              onChange={(e) => setConfirmId(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
