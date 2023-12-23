import { auth, currentUser } from "@clerk/nextjs";
import ClientPage from "./ClientPage";

export default async function NewPost() {
  const user = await currentUser();
  const { getToken } = auth();
  const token = await getToken();
  return <ClientPage username={user?.username} token={token} />;
}
