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

const postToTimeline = async (post: Post): Promise<void> => {
  try {
    await addDoc(collection(db, "posts"), {
      ...post,
      timestamp: Timestamp.now(),
    });
  } catch (e) {
    console.error("Failed to create post: ", e);
    throw new Error("Unable to post to timeline.");
  }
};

const getTimelinePosts = async (): Promise<Post[]> => {
  try {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as unknown as Post[];
  } catch (e) {
    console.error("Error getting timeline posts: ", e);
    throw new Error("Unable to retrieve timeline posts.");
  }
};

export { postToTimeline, getTimelinePosts };
