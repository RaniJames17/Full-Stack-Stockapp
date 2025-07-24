interface Props {
  params: Promise<{ username: string }>;
}

export default async function UserProfile({ params }: Props) {
  const { username } = await params;
  
  return (
    <main>
      <h1>User Profile: {username}</h1>
      <p>Welcome to the profile of {username}.</p>
    </main>
  );
}
