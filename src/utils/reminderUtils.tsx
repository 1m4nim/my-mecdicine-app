import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore"
import { db } from "../firebase"
import dayjs from "dayjs"

// 型定義
export interface Reminder {
  userId: string
  date: Timestamp | Date
  type: "朝" | "昼" | "夕" | "就寝前"
  createdAt?: Timestamp
}

const REMINDERS_COLLECTION = "weeklyReminders"

// 今週のリマインダーを取得
export async function getRemindersThisWeek(): Promise<Reminder[]> {
  const colRef = collection(db, REMINDERS_COLLECTION)
  const snapshot = await getDocs(colRef)
  const now = dayjs()
  const startOfWeek = now.startOf("week")
  const endOfWeek = now.endOf("week")

  const reminders: Reminder[] = snapshot.docs
    .map((doc) => doc.data() as Reminder)
    .filter((reminder) => {
      if (!reminder.date || !reminder.userId) return false
      const date = dayjs(reminder.date instanceof Timestamp ? reminder.date.toDate() : reminder.date)
      return date.isAfter(startOfWeek) && date.isBefore(endOfWeek)
    })

  return reminders
}

// 前週の設定をコピー
export async function copyLastWeekReminders(mode: "check" | "copy" = "copy"): Promise<Reminder[]> {
  const colRef = collection(db, REMINDERS_COLLECTION)
  const snapshot = await getDocs(colRef)

  const now = dayjs()
  const lastWeekStart = now.subtract(1, "week").startOf("week")
  const lastWeekEnd = now.subtract(1, "week").endOf("week")

  const lastWeekReminders: Reminder[] = snapshot.docs
    .map((doc) => doc.data() as Reminder)
    .filter((reminder) => {
      const date = dayjs(reminder.date instanceof Timestamp ? reminder.date.toDate() : reminder.date)
      return date.isAfter(lastWeekStart) && date.isBefore(lastWeekEnd)
    })

  if (mode === "check") {
    return lastWeekReminders
  }

  const copied: Reminder[] = []
  for (const reminder of lastWeekReminders) {
    const newDate = dayjs(reminder.date instanceof Timestamp ? reminder.date.toDate() : reminder.date).add(7, "day")
    const newReminder: Reminder = {
      ...reminder,
      date: Timestamp.fromDate(newDate.toDate()),
      createdAt: Timestamp.now(),
    }
    await addDoc(colRef, newReminder)
    copied.push(newReminder)
  }

  return copied
}
