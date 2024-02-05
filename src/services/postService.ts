import { db } from "../modules/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";

interface Post {
  message: string;
  timestamp?: Timestamp;
  icon: string;
}

// タイムラインへの投稿
async function postToTimeline(post: Post): Promise<void> {
  await addDoc(collection(db, "posts"), {
    ...post,
    timestamp: Timestamp.now(),
  });
}

// タイムラインの投稿を取得
async function getTimelinePosts(): Promise<Post[]> {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate(),
  })) as unknown as Post[];
}

export { postToTimeline, getTimelinePosts };
