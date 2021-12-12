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
  text: getRandomText(),
  sender: allUsers[Math.floor(Math.random() * allUsers.length)],
}));

export const worker = setupWorker(
  rest.get('/api/messages', (req, res, ctx) => {
    const {
      message_id = allMessages[allMessages.length - 1].id,
      prev_limit = 20,
    } = req.params;

    const lastIndex = allMessages.findIndex(
      (message) => message.id === message_id
    );
    const result = allMessages.slice(lastIndex - prev_limit, lastIndex);

    return res(
      ctx.delay(1500),
      ctx.status(200),
      ctx.json({ messages: result })
    );
  })
);
