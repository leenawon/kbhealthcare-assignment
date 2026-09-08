import { http, HttpResponse } from 'msw';
import type { TaskItem } from '../types/api';

const PAGE_SIZE = 5;

const MOCK_USER = {
  name: '이나원',
  memo: 'KB헬스케어 프론트엔드 지원자입니다.',
};

let mockTasks: TaskItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: `task-${i + 1}`,
  title: `할 일 ${i + 1}`,
  memo: `할 일 ${i + 1}에 대한 메모입니다.`,
  status: i % 3 === 0 ? 'DONE' : 'TODO',
}));

function requireAuth(request: Request) {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) {
    return HttpResponse.json({ errorMessage: '인증이 필요합니다.' }, { status: 401 });
  }
  return null;
}

export const handlers = [
  http.post('/api/sign-in', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };

    if (!body.email || !body.password) {
      return HttpResponse.json(
        { errorMessage: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    });
  }),

  http.post('/api/refresh', ({ request }) => {
    const cookie = request.headers.get('cookie') ?? '';
    if (!cookie.includes('token=')) {
      return HttpResponse.json({ errorMessage: '인증이 만료되었습니다.' }, { status: 401 });
    }
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    });
  }),

  http.get('/api/user', ({ request }) => {
    const authError = requireAuth(request);
    if (authError) return authError;
    return HttpResponse.json(MOCK_USER);
  }),

  http.get('/api/dashboard', ({ request }) => {
    const authError = requireAuth(request);
    if (authError) return authError;

    const numOfDoneTask = mockTasks.filter((t) => t.status === 'DONE').length;
    return HttpResponse.json({
      numOfTask: mockTasks.length,
      numOfRestTask: mockTasks.length - numOfDoneTask,
      numOfDoneTask,
    });
  }),

  http.get('/api/task', ({ request }) => {
    const authError = requireAuth(request);
    if (authError) return authError;

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const data = mockTasks.slice(start, end);
    const hasNext = end < mockTasks.length;

    return HttpResponse.json({ data, hasNext });
  }),

  http.get('/api/task/:id', ({ request, params }) => {
    const authError = requireAuth(request);
    if (authError) return authError;

    const task = mockTasks.find((t) => t.id === params.id);
    if (!task) {
      return HttpResponse.json({ errorMessage: '존재하지 않는 할 일입니다.' }, { status: 404 });
    }

    return HttpResponse.json({
      title: task.title,
      memo: task.memo,
      registerDatetime: new Date().toISOString(),
    });
  }),

  http.delete('/api/task/:id', ({ request, params }) => {
    const authError = requireAuth(request);
    if (authError) return authError;

    const index = mockTasks.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ errorMessage: '존재하지 않는 할 일입니다.' }, { status: 404 });
    }

    mockTasks = mockTasks.filter((t) => t.id !== params.id);
    return HttpResponse.json({ success: true });
  }),
];
