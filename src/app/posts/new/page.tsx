import { auth, currentUser } from "@clerk/nextjs/server";
import ClientPage from "./ClientPage";

export default async function NewPost() {
  const user = await currentUser();
  const { getToken } = await auth();
  const token = await getToken();
  return <ClientPage username={user?.username} token={token} />;
}
