import React, { useEffect, useState } from "react"
import { TimePicker, Checkbox, Button, Spin } from "antd"
import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import "dayjs/locale/ja"
import "antd/dist/reset.css"
import { db } from "../firebase"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"

type Props = {
  onClose: () => void
  onSaveSuccess?: (savedData: {
    times: Record<string, string>
    selectedDays: string[]
  }) => void
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const
type Weekday = typeof WEEKDAYS[number]

type TimesRecord = Record<string, Dayjs | null>

const getOrCreateUserId = (): string => {
  const key = "anonUserId"
  let id = localStorage.getItem(key)
  if (!id) {
    id = "anon-" + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(key, id)
  }
  return id
}

const ReminderForm: React.FC<Props> = ({ onClose, onSaveSuccess }) => {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [times, setTimes] = useState<TimesRecord>({
    朝: null,
    昼: null,
    夕: null,
    就寝前: null,
  })

  const [selectedDays, setSelectedDays] = useState<Weekday[]>([])

  const parseTimesFromFirestore = (data: Record<string, string>): TimesRecord => {
    const result: TimesRecord = { 朝: null, 昼: null, 夕: null, 就寝前: null }
    for (const label of Object.keys(result)) {
      if (data[label] && data[label].match(/^\d{2}:\d{2}$/)) {
        result[label] = dayjs(data[label], "HH:mm")
      }
    }
    return result
  }

  useEffect(() => {
    const id = getOrCreateUserId()
    setUserId(id)
  }, [])

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    const fetchData = async () => {
      try {
        const docRef = doc(db, "reminders", userId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data) {
            if (data.times && typeof data.times === "object") {
              setTimes(parseTimesFromFirestore(data.times))
            }
            if (Array.isArray(data.selectedDays)) {
              setSelectedDays(data.selectedDays)
            }
          }
        }
      } catch (err) {
        console.error("データ取得エラー:", err)
        alert("保存済みリマインダーの取得に失敗しました")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userId])

  const handleTimeChange = (label: string, value: Dayjs | null) => {
    setTimes((prev) => ({ ...prev, [label]: value }))
  }

  const toggleDay = (day: Weekday) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSave = async () => {
    if (!userId) {
      alert("ユーザーIDがありません。リロードしてください。")
      return
    }
    if (selectedDays.length === 0) {
      alert("曜日を少なくとも1つ選択してください")
      return
    }
    const formattedTimes: Record<string, string> = Object.fromEntries(
      Object.entries(times).map(([label, time]) => [
        label,
        time ? time.format("HH:mm") : "",
      ])
    )
    setSaving(true)
    try {
      const docRef = doc(db, "reminders", userId)
      await setDoc(docRef, {
        times: formattedTimes,
        selectedDays,
        updatedAt: serverTimestamp(),
      })
      alert(
        `保存しました！\n` +
          `時間設定:\n${Object.entries(formattedTimes)
            .map(([label, time]) => `・${label}: ${time || "未設定"}`)
            .join("\n")}\n` +
          `曜日:\n${selectedDays.join("、")}`
      )
      if (onSaveSuccess) {
        onSaveSuccess({ times: formattedTimes, selectedDays })
      }
      onClose()
    } catch (err) {
      console.error("保存エラー:", err)
      alert("保存に失敗しました")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <Spin size="large" tip="データを読み込み中です..." />
      </div>
    )
  }

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "2rem",
        background: "#f9fcff",
        border: "1px solid #c3d7e6",
        borderRadius: "10px",
        width: "540px",
        marginInline: "auto",
        fontFamily: "sans-serif",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        🕒 服薬リマインダー設定（24時間制）
      </h2>

      {(["朝", "昼", "夕", "就寝前"] as const).map((label) => (
        <div
          key={label}
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <label style={{ width: "120px", fontSize: "1.1rem" }}>{label}の時間：</label>
          <TimePicker
            value={times[label]}
            onChange={(value) => handleTimeChange(label, value)}
            format="HH:mm"
            minuteStep={5}
            allowClear={false}
            inputReadOnly
            style={{ width: 120 }}
            disabled={saving}
          />
        </div>
      ))}

      <div style={{ marginBottom: "2rem" }}>
        <label
          style={{ display: "block", marginBottom: "0.5rem", fontSize: "1.1rem" }}
        >
          曜日を選択してください：
        </label>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {WEEKDAYS.map((day) => (
            <label key={day} style={{ userSelect: "none" }}>
              <Checkbox
                checked={selectedDays.includes(day)}
                onChange={() => toggleDay(day)}
                disabled={saving}
              >
                {day}
              </Checkbox>
            </label>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          onClick={handleSave}
          loading={saving}
          style={{ marginRight: "1rem" }}
        >
          設定を保存する
        </Button>
        <Button onClick={onClose} danger disabled={saving}>
          閉じる
        </Button>
      </div>
    </div>
  )
}

export default ReminderForm
