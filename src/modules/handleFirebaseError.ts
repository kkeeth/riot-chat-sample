import { FirebaseError } from "firebase/app";

export const handleFirebaseError = (error: FirebaseError): string => {
  switch (error.code) {
    case "auth/invalid-email":
      return "無効なメールアドレスです。";
    case "auth/user-disabled":
      return "このユーザーは無効です。";
    case "auth/user-not-found":
      return "ユーザーが見つかりません。";
    case "auth/wrong-password":
      return "間違ったパスワードです。";
    case "auth/email-already-in-use":
      return "このメールアドレスは既に使用されています。";
    case "auth/weak-password":
      return "パスワードが弱すぎます。";
    default:
      return "エラーが発生しました。後ほど再試行してください。";
  }
};
