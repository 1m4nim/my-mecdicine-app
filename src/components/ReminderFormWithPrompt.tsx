import React, { useEffect, useState } from "react";
import { TimePicker, Checkbox, Button, message } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { db } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

dayjs.locale("ja");

const timings = ["朝", "昼", "夕", "就寝前"];
const daysOfWeek = ["月", "火", "水", "木", "金", "土", "日"];

const ReminderFormWithPrompt = () => {
  const [selectedDay, setSelectedDay] = useState<string>("月");
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<{
    [timing: string]: {
      time: Dayjs | null;
      beforeMeal: boolean;
      afterMeal: boolean;
    };
  }>({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const docRef = doc(db, "reminders", selectedDay);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const converted: typeof values = {};
        for (const timing of Object.keys(data)) {
          converted[timing] = {
            time: data[timing].time
              ? dayjs(
                  data[timing].time?.toDate
                    ? data[timing].time.toDate()
                    : data[timing].time
                )
              : null,
            beforeMeal: !!data[timing].beforeMeal,
            afterMeal: !!data[timing].afterMeal,
          };
        }
        setValues(converted);
      } else {
        setValues({});
      }
      setLoading(false);
    };
    loadData();
  }, [selectedDay]);

  const handleTimeChange = (timing: string, time: Dayjs | null) => {
    setValues((prev) => ({
      ...prev,
      [timing]: { ...prev[timing], time },
    }));
  };

  const handleCheckboxChange = (
    timing: string,
    field: "beforeMeal" | "afterMeal",
    checked: boolean
  ) => {
    setValues((prev) => ({
      ...prev,
      [timing]: { ...prev[timing], [field]: checked },
    }));
  };

  const handleSave = async () => {
    const dataToSave: any = {};
    for (const timing of timings) {
      const value = values[timing];
      if (value) {
        dataToSave[timing] = {
          time: value.time ? value.time.toDate() : null,
          beforeMeal: value.beforeMeal || false,
          afterMeal: value.afterMeal || false,
        };
      }
    }

    try {
      await setDoc(doc(db, "reminders", selectedDay), {
        ...dataToSave,
        updatedAt: serverTimestamp(),
      });
      message.success("リマインダーを保存しました！");
    } catch (err) {
      console.error(err);
      message.error("保存に失敗しました。");
    }
  };

  const handleCopyFromPrevious = async () => {
    const currentIndex = daysOfWeek.indexOf(selectedDay);
    const prevDay = daysOfWeek[(currentIndex + 6) % 7];
    const docRef = doc(db, "reminders", prevDay);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const copied: typeof values = {};
      for (const timing of Object.keys(data)) {
        copied[timing] = {
          time: data[timing].time
            ? dayjs(
                data[timing].time?.toDate
                  ? data[timing].time.toDate()
                  : data[timing].time
              )
            : null,
          beforeMeal: !!data[timing].beforeMeal,
          afterMeal: !!data[timing].afterMeal,
        };
      }
      setValues(copied);
      message.success("前週のデータをコピーしました！");
    } else {
      message.warning("前週のデータが見つかりませんでした。");
    }
  };

  const getDayButtonStyle = (day: string, index: number) => {
    if (day === selectedDay) {
      return { backgroundColor: "#e6f7ff", fontWeight: "bold" };
    }
    if (index === 6) {
      return { backgroundColor: "#ffcccc", color: "red" }; // 日曜
    }
    if (index === 5) {
      return { backgroundColor: "#cce5ff", color: "blue" }; // 土曜
    }
    return { backgroundColor: "white", color: "black" };
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem",
        color: "black",
        backgroundColor: "#f5f0e1", // 薄ブラウン背景
        minHeight: "100vh",
      }}
    >
      <h2 style={{ marginTop: "4rem" }}>服薬リマインダー</h2>

      <div style={{ marginBottom: "1rem" }}>
        {daysOfWeek.map((day, index) => (
          <Button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              margin: "0 4px",
              ...getDayButtonStyle(day, index),
            }}
          >
            {day}
          </Button>
        ))}
      </div>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          {timings.map((timing) => (
            <div
              key={timing}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <h3>{timing}</h3>
              <TimePicker
                value={values[timing]?.time || null}
                onChange={(time) => handleTimeChange(timing, time)}
                format="HH:mm"
              />
              <div style={{ marginTop: "0.5rem" }}>
                <Checkbox
                  checked={values[timing]?.beforeMeal || false}
                  onChange={(e) =>
                    handleCheckboxChange(timing, "beforeMeal", e.target.checked)
                  }
                >
                  食前
                </Checkbox>
                <Checkbox
                  checked={values[timing]?.afterMeal || false}
                  onChange={(e) =>
                    handleCheckboxChange(timing, "afterMeal", e.target.checked)
                  }
                  style={{ marginLeft: "1rem" }}
                >
                  食後
                </Checkbox>
              </div>
            </div>
          ))}
          <Button type="primary" onClick={handleSave} style={{ marginRight: 10 }}>
            保存
          </Button>
          <Button type="dashed" onClick={handleCopyFromPrevious}>
            前週の設定をコピー
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReminderFormWithPrompt;
