import { setupWorker, rest } from 'msw';
import { loremIpsum } from 'lorem-ipsum';

function getRandomText() {
  return loremIpsum({
    count: 1,
    paragraphLowerBound: 3,
    paragraphUpperBound: 7,
    units: 'paragraph',
  });
}

const allUsers = [...new Array(5)].map((_, index) => ({
  id: index,
  name: `User ${index}`,
}));

const allMessages = [...new Array(500)].map((_, index) => ({
  id: index,
  text: `#${index} ${getRandomText()}`,
  sender: allUsers[Math.floor(Math.random() * allUsers.length)],
}));

function getPage({ pageSize, messages, endIndex }) {
  if (endIndex < 0) {
    return messages.slice(messages.length - pageSize, messages.length);
  }
  return messages.slice(endIndex - pageSize, endIndex);
}

export const worker = setupWorker(
  rest.get('/api/messages', (req, res, ctx) => {
    const message_id = req.url.searchParams.get('message_id') || -1;
    const prev_limit = req.url.searchParams.get('prev_limit') || 20;

    const endIndex = allMessages.findIndex(
      (message) => message.id === Number(message_id)
    );

    const result = getPage({
      messages: allMessages,
      pageSize: Number(prev_limit),
      endIndex,
    });

    return res(
      ctx.delay(1500),
      ctx.status(200),
      ctx.json({ messages: result })
    );
  })
);
