import { db } from '../firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

/**
 * 服薬リマインダーのデータを Firestore に保存します。
 *  * @param days 服用する日数（例: 7）
 * @returns Firestore に保存されたドキュメントの ID
 */
export const saveReminderToFirestore = async (
  times: Record<string, string>,
  days: number
): Promise<string> => {
  const data = {
    times,
    days,
    createdAt: Timestamp.now(),
  }

  const docRef = await addDoc(collection(db, 'reminders'), data)
  return docRef.id
}
