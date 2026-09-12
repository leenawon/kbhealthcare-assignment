import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | KB헬스케어`;
    return () => {
      document.title = 'KB헬스케어';
    };
  }, [title]);
}
