import { setupWorker, rest } from 'msw';

export const worker = setupWorker(
  rest.get('/api/messages', (req, res, ctx) => {
    return res(
      ctx.delay(1500),
      ctx.status(200),
      ctx.json({ messages: [{ id: 1, text: 'Hello' }] })
    );
  })
);
