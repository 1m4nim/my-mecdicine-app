import React, { useEffect, useState } from "react";
import { TimePicker, Checkbox, Button, Spin, Modal, message } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import "antd/dist/reset.css";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

// 曜日の定義
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;
type Weekday = (typeof WEEKDAYS)[number];
type TimesRecord = Record<string, Dayjs | null>;

type Props = {
  onClose: () => void;
  onSaveSuccess: (data: {
    id: string;
    times: Record<string, string>;
    selectedDays: string[];
  }) => void;
};

const getOrCreateUserId = (): string => {
  const key = "anonUserId";
  let id = localStorage.getItem(key);
  if (!id) {
    id =
      "anon-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, id);
  }
  return id;
};

const ReminderFormWithPrompt: React.FC<Props> = ({
  onClose,
  onSaveSuccess,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [times, setTimes] = useState<TimesRecord>({
    朝: dayjs("08:00", "HH:mm"),
    昼: dayjs("12:00", "HH:mm"),
    夕: dayjs("18:00", "HH:mm"),
    就寝前: dayjs("21:00", "HH:mm"),
  });
  const [selectedDays, setSelectedDays] = useState<Weekday[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [savedTimes, setSavedTimes] = useState<TimesRecord>({
    朝: null,
    昼: null,
    夕: null,
    就寝前: null,
  });
  const [savedDays, setSavedDays] = useState<Weekday[]>([]);

  const parseTimesFromFirestore = (
    data: Record<string, string>
  ): TimesRecord => {
    const result: TimesRecord = { 朝: null, 昼: null, 夕: null, 就寝前: null };
    for (const label of Object.keys(result)) {
      if (data[label] && /^\d{2}:\d{2}$/.test(data[label])) {
        result[label] = dayjs(data[label], "HH:mm");
      }
    }
    return result;
  };

  useEffect(() => {
    const id = getOrCreateUserId();
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "reminders", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.times) {
            const parsed = parseTimesFromFirestore(data.times);
            setTimes(parsed);
            setSavedTimes(parsed);
          }
          if (Array.isArray(data.selectedDays)) {
            setSelectedDays(data.selectedDays);
            setSavedDays(data.selectedDays);
          }
        }
      } catch (error) {
        message.error("データの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleTimeChange = (label: string, value: Dayjs | null) => {
    setTimes((prev) => ({ ...prev, [label]: value }));
  };

  const toggleDay = (day: Weekday) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (!userId) {
      alert("ユーザーIDが見つかりません。ページを再読み込みしてください。");
      return;
    }

    if (selectedDays.length === 0) {
      alert("少なくとも1つの曜日を選択してください。");
      return;
    }

    const formattedTimes: Record<string, string> = Object.fromEntries(
      Object.entries(times).map(([label, time]) => [
        label,
        time ? time.format("HH:mm") : "",
      ])
    );

    setSaving(true);
    try {
      await setDoc(doc(db, "reminders", userId), {
        times: formattedTimes,
        selectedDays,
        updatedAt: serverTimestamp(),
      });

      message.success("保存しました");

      setSavedTimes(times);
      setSavedDays(selectedDays);

      onSaveSuccess({
        id: userId,
        times: formattedTimes,
        selectedDays,
      });
    } catch (err) {
      console.error(err);
      message.success("リマインダーを保存しました");
      alert("");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;

    try {
      await deleteDoc(doc(db, "reminders", userId));
      message.success("リマインダーを削除しました");
      const empty: TimesRecord = {
        朝: null,
        昼: null,
        夕: null,
        就寝前: null,
      };
      setTimes(empty);
      setSavedTimes(empty);
      setSelectedDays([]);
      setSavedDays([]);
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました");
    } finally {
      setDeleteModalVisible(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {/* 削除確認モーダル */}
      <Modal
        title="リマインダーの削除"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="削除する"
        cancelText="キャンセル"
      >
        <p>リマインダーを削除しますか？この操作は取り消せません。</p>
      </Modal>

      {(savedDays.length > 0 ||
        Object.values(savedTimes).some((t) => t !== null)) && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem 2rem",
            backgroundColor: "#f0f8ff",
            border: "1px solid #b0c4de",
            borderRadius: "10px",
            width: "540px",
            margin: "0 auto",
            color: "blue",
            fontFamily: "sans-serif",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              marginBottom: "1rem",
              marginTop: "8rem",
            }}
          >
            📋 現在のリマインダー設定
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {(["朝", "昼", "夕", "就寝前"] as const).map((label) => (
              <li key={label} style={{ marginBottom: "0.4rem" }}>
                <strong>{label}</strong>：{" "}
                {savedTimes[label]
                  ? savedTimes[label]!.format("HH:mm")
                  : "未設定"}
              </li>
            ))}
          </ul>
          <p>
            <strong>曜日：</strong>{" "}
            {savedDays.length > 0 ? savedDays.join("、") : "未選択"}
          </p>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Button danger onClick={() => setDeleteModalVisible(true)}>
              リマインダーを削除する
            </Button>
          </div>
        </div>
      )}

      {/* 入力フォーム */}
      <div
        style={{
          marginTop: "2rem",
          padding: "2rem",
          background: "#ffffff",
          border: "1px solid #d9e6f2",
          borderRadius: "10px",
          width: "540px",
          marginInline: "auto",
          fontFamily: "sans-serif",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{ textAlign: "center", marginBottom: "2rem", color: "blue" }}
        >
          🕒 服薬リマインダー設定（24時間制）
        </h2>

        {(["朝", "昼", "夕", "就寝前"] as const).map((label) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              color: "blue",
            }}
          >
            <label style={{ width: "100px" }}>{label}</label>
            <TimePicker
              value={times[label]}
              onChange={(value) => handleTimeChange(label, value)}
              format="HH:mm"
              minuteStep={5}
              allowClear={false}
              style={{ width: 120 }}
              inputReadOnly
              disabled={saving}
            />
          </div>
        ))}

        <div style={{ marginTop: "1.5rem" }}>
          <p>曜日を選択してください：</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {WEEKDAYS.map((day) => (
              <Checkbox
                key={day}
                checked={selectedDays.includes(day)}
                onChange={() => toggleDay(day)}
                disabled={saving}
              >
                {day}
              </Checkbox>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Button
            type="primary"
            onClick={handleSave}
            loading={saving}
            style={{ marginRight: "1rem" }}
          >
            設定を保存する
          </Button>
        </div>
      </div>
    </>
  );
};

export default ReminderFormWithPrompt;
