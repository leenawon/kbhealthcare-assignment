import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navigate, useLocation } from 'react-router-dom';
import { authApi } from '../api/auth';
import { ApiError } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { usePageTitle } from '../hooks/usePageTitle';
import { Modal } from '../components/Modal';
import styles from './SignIn.module.css';

const signInSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('유효한 이메일 형식이 아닙니다.'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(24, '비밀번호는 24자 이하여야 합니다.')
    .regex(/^[A-Za-z0-9]+$/, '영문과 숫자만 사용 가능합니다.'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignIn() {
  const auth = useAuth();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, touchedFields, dirtyFields },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  usePageTitle('로그인');

  if (auth.isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data: SignInFormValues) => {
    try {
      const tokens = await authApi.signIn(data);
      auth.signIn(tokens);
      // navigate는 auth.signIn 후 isAuthenticated가 true가 되면
      // 위의 guard가 from으로 이동하므로 별도 호출 불필요
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.errorMessage);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>로그인</h1>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              이메일
            </label>
            <input
              id="email"
              type="email"
              className={`${styles.input} ${touchedFields.email && errors.email ? styles.inputError : ''}`}
              placeholder="이메일을 입력하세요"
              aria-describedby={touchedFields.email && errors.email ? 'email-error' : undefined}
              {...register('email')}
            />
            {touchedFields.email && errors.email && (
              <span id="email-error" className={styles.errorMessage} role="alert">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              maxLength={24}
              className={`${styles.input} ${dirtyFields.password && errors.password ? styles.inputError : ''}`}
              placeholder="비밀번호를 입력하세요"
              aria-describedby={dirtyFields.password && errors.password ? 'password-error' : undefined}
              {...register('password')}
            />
            {dirtyFields.password && errors.password && (
              <span id="password-error" className={styles.errorMessage} role="alert">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>

      <Modal
        isOpen={errorMessage !== null}
        onClose={() => setErrorMessage(null)}
        title="로그인 실패"
      >
        {errorMessage}
      </Modal>
    </div>
  );
}
