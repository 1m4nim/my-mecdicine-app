import React, { useEffect, useState } from "react";
import { TimePicker, Checkbox, Button, Spin, Modal, message } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

dayjs.locale("ja");

type ReminderTime = {
  beforeMeal: Dayjs | null;
  afterMeal: Dayjs | null;
  beforeSleep: Dayjs | null;
};

type ReminderData = {
  [key: string]: {
    active: boolean;
    times: ReminderTime;
  };
};

const weekdays = ["月", "火", "水", "木", "金", "土", "日"];

const ReminderFormWithPrompt = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [times, setTimes] = useState<ReminderTime>({
    beforeMeal: null,
    afterMeal: null,
    beforeSleep: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const reminderId = "reminder-setting";

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "reminders", reminderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as ReminderData;
        const today = new Date().getDay();
        const weekdayIndex = (today + 6) % 7;
        const day = weekdays[weekdayIndex];
        if (data[day]) {
          setSelectedDays(
            Object.entries(data)
              .filter(([_, value]) => value.active)
              .map(([key]) => key)
          );
          setTimes(data[day].times);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (day: string, checked: boolean) => {
    setSelectedDays((prev) =>
      checked ? [...prev, day] : prev.filter((d) => d !== day)
    );
  };

  const handleTimeChange = (type: keyof ReminderTime, time: Dayjs | null) => {
    setTimes((prev) => ({ ...prev, [type]: time }));
  };

  const handleSave = async () => {
    setSaving(true);
    const newData: ReminderData = {};
    weekdays.forEach((day) => {
      newData[day] = {
        active: selectedDays.includes(day),
        times,
      };
    });

    try {
      await setDoc(doc(db, "reminders", reminderId), {
        ...newData,
        timestamp: serverTimestamp(),
      });
      message.success("リマインダーを保存しました");
    } catch {
      message.error("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: "削除確認",
      content: "本当に削除しますか？",
      okText: "削除",
      cancelText: "キャンセル",
      onOk: async () => {
        await deleteDoc(doc(db, "reminders", reminderId));
        setSelectedDays([]);
        setTimes({ beforeMeal: null, afterMeal: null, beforeSleep: null });
        message.success("リマインダーを削除しました。");
      },
    });
  };

  if (loading) return <Spin />;

  return (
    <div
      style={{
        backgroundColor: "#f5f0e6",
        padding: "2rem",
        borderRadius: "1rem",
        fontSize: "1.5rem",
        fontWeight: 500,
        color: "#000",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {weekdays.map((day, idx) => {
            const isSelected = selectedDays.includes(day);
            const isSunday = idx === 6;
            const isSaturday = idx === 5;
            return (
              <label
                key={day}
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "bold",
                  color: isSunday
                    ? "red"
                    : isSaturday
                    ? "blue"
                    : isSelected
                    ? "#000"
                    : "#aaa",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={(e) =>
                    handleCheckboxChange(day, e.target.checked)
                  }
                  style={{ transform: "scale(2)", marginRight: "0.5rem" }}
                />
                {day}
              </label>
            );
          })}
        </div>
      </div>

      <table style={{ width: "100%", borderSpacing: "1.5rem" }}>
        <thead>
          <tr>
            <th style={{ fontSize: "1.6rem", color: "black", fontWeight: "bold" }}>項目</th>
            <th style={{ fontSize: "1.6rem", color: "black", fontWeight: "bold" }}>有効</th>
            <th style={{ fontSize: "1.6rem", color: "black", fontWeight: "bold" }}>食前</th>
            <th style={{ fontSize: "1.6rem", color: "black", fontWeight: "bold" }}>食後</th>
            <th style={{ fontSize: "1.6rem", color: "black", fontWeight: "bold" }}>就寝前時間</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: "center" }}>服薬</td>
            <td style={{ textAlign: "center" }}>
              <Checkbox
                checked={
                  !!(times.beforeMeal || times.afterMeal || times.beforeSleep)
                }
                disabled
                style={{ transform: "scale(2)" }}
              />
            </td>
            <td style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {times.beforeMeal ? times.beforeMeal.format("HH:mm") : "ー"}
              </div>
              <TimePicker
                value={times.beforeMeal}
                onChange={(time) => handleTimeChange("beforeMeal", time)}
                format="HH:mm"
                placeholder="選択"
                style={{ fontSize: "1.5rem", width: "100%" }}
              />
            </td>
            <td style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {times.afterMeal ? times.afterMeal.format("HH:mm") : "ー"}
              </div>
              <TimePicker
                value={times.afterMeal}
                onChange={(time) => handleTimeChange("afterMeal", time)}
                format="HH:mm"
                placeholder="選択"
                style={{ fontSize: "1.5rem", width: "100%" }}
              />
            </td>
            <td style={{ textAlign: "center" }}>
              <TimePicker
                value={times.beforeSleep}
                onChange={(time) => handleTimeChange("beforeSleep", time)}
                format="HH:mm"
                placeholder="選択"
                style={{ fontSize: "1.5rem", width: "100%" }}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <Button type="primary" onClick={handleSave} loading={saving} size="large">
          保存
        </Button>
        <Button danger onClick={handleDelete} size="large">
          削除
        </Button>
      </div>
    </div>
  );
};

export default ReminderFormWithPrompt;
