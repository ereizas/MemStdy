import { ClerkProvider, useClerk, useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
