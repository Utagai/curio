import { auth, currentUser } from "@clerk/nextjs/server";
import NewPostClientPage from "./NewPostClientPage";

export default async function NewPost() {
  const user = await currentUser();
  const { getToken } = await auth();
  const token = await getToken();
  return <NewPostClientPage username={user?.username} token={token} />;
}
