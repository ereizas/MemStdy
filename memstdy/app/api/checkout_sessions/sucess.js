// pages/success.js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const router = useRouter();
  const { session_id } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      // You can fetch session details here if needed
      setLoading(false);
    }
  }, [session_id]);

  return (
    <div>
      <h1>Payment Successful!</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>Your session ID is: {session_id}</p>
      )}
    </div>
  );
}
