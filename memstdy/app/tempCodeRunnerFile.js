import { ClerkProvider, useUser, SignInButton, SignOutButton } from '@clerk/nextjs';

function UserInfo() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        <p>Welcome, {user.firstName}!</p>
        <p>Email: {user.emailAddress}</p>
      </div>
    );
  }

  return <p>Not signed in</p>;
}

export default function HomePage() {
  return (
    <ClerkProvider frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}>
      <div>
        <SignInButton />
        <SignOutButton />
        <UserInfo />
      </div>
    </ClerkProvider>
  );
}
