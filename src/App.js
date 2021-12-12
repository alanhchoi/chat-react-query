import { Fragment } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';

import './App.css';

async function getPreviousMessages(messageId) {
  const searchParams = new URLSearchParams({ prev_limit: 20 });
  if (messageId != null) {
    searchParams.set('message_id', messageId);
  }

  const response = await fetch('/api/messages?' + searchParams.toString());
  return response.json();
}

async function fetchUser(userId) {
  const response = await fetch('/api/users/' + userId);
  return response.json();
}

function Sender({ sender }) {
  const { data } = useQuery(['users', sender.id], () => fetchUser(sender.id));
  const isMuted = data?.isMuted;
  return (
    <div className="message__sender">
      {sender.name} {isMuted && ' (Muted)'}
    </div>
  );
}

function App() {
  const {
    data,
    error,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
    status,
  } = useInfiniteQuery(
    'messages',
    ({ pageParam: messageId }) => getPreviousMessages(messageId),
    {
      getPreviousPageParam: (firstPage) => firstPage.messages[0].id,
      refetchOnWindowFocus: false,
    }
  );

  if (status === 'loading') {
    return <div className="app__container">Loading...</div>;
  }
  if (status === 'error') {
    return <div className="app__container">Error! {error.message}</div>;
  }
  return (
    <div className="app__container">
      <div>
        <button
          onClick={() => fetchPreviousPage()}
          disabled={!hasPreviousPage || isFetchingPreviousPage}
        >
          {isFetchingPreviousPage
            ? 'Loading more...'
            : hasPreviousPage
            ? 'Load More'
            : 'Nothing more to load'}
        </button>
      </div>
      {data.pages.map((group, index) => (
        <Fragment key={index}>
          {group.messages.map((message) => {
            const { id, text, sender } = message;
            return (
              <div key={id} className="message">
                <Sender sender={sender} />
                <div className="message__text">{text}</div>
              </div>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}

export default App;
