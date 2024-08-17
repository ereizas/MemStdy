// pages/cancel.js

import { useRouter } from 'next/router';

export default function CancelPage() {
  const router = useRouter();
  const { session_id } = router.query;

  return (
    <div>
      <h1>Payment Canceled</h1>
      {session_id ? (
        <p>Your session ID is: {session_id}</p>
      ) : (
        <p>No session ID was provided.</p>
      )}
    </div>
  );
}
