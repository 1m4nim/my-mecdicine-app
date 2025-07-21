import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const daysOfWeek = ["月", "火", "水", "木", "金", "土", "日"];
const dayColors: { [key: string]: string } = {
  月: "black",
  火: "black",
  水: "black",
  木: "black",
  金: "black",
  土: "blue",
  日: "red",
};

type ReminderData = {
  times: Record<
    string,
    {
      morningBefore: string;
      morningAfter: string;
      afternoonBefore: string;
      afternoonAfter: string;
      eveningBefore: string;
      eveningAfter: string;
      beforeBed: string;
    }
  >;
  checked: Record<
    string,
    {
      morningBefore: boolean;
      morningAfter: boolean;
      afternoonBefore: boolean;
      afternoonAfter: boolean;
      eveningBefore: boolean;
      eveningAfter: boolean;
    }
  >;
};

const SavedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ReminderData | undefined;

  // ローカルストレージから読み込み用ステート
  const [savedData, setSavedData] = useState<ReminderData | null>(null);

  useEffect(() => {
    if (state) {
      // もしナビゲーションのstateがあればそれを使う
      setSavedData(state);
      // ローカルストレージにも保存しておく
      localStorage.setItem("reminderData", JSON.stringify(state));
    } else {
      // stateがなければローカルストレージをチェック
      const lsData = localStorage.getItem("reminderData");
      if (lsData) {
        try {
          setSavedData(JSON.parse(lsData));
        } catch {
          setSavedData(null);
        }
      }
    }
  }, [state]);

  if (!savedData) {
    return (
      <div>
        <p>保存されたデータがありません。</p>
        <button onClick={() => navigate("/")}>戻る</button>
      </div>
    );
  }

  const { times, checked } = savedData;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>保存されたリマインダー内容</h2>
      {daysOfWeek.map((day) => {
        const dayTimes = times[day];
        const dayChecked = checked[day];
        if (
          !dayChecked.morningBefore &&
          !dayChecked.morningAfter &&
          !dayChecked.afternoonBefore &&
          !dayChecked.afternoonAfter &&
          !dayChecked.eveningBefore &&
          !dayChecked.eveningAfter &&
          !dayTimes.beforeBed
        ) {
          return null;
        }
        return (
          <div
            key={day}
            style={{ borderBottom: "1px solid #ccc", padding: 10, color: "black" }}
          >
            <h3 style={{ color: dayColors[day] }}>{day}曜日</h3>
            <p>
              朝:
              {dayChecked.morningBefore ? ` 食前 ${dayTimes.morningBefore}` : ""}
              {dayChecked.morningAfter ? ` 食後 ${dayTimes.morningAfter}` : ""}
            </p>
            <p>
              昼:
              {dayChecked.afternoonBefore ? ` 食前 ${dayTimes.afternoonBefore}` : ""}
              {dayChecked.afternoonAfter ? ` 食後 ${dayTimes.afternoonAfter}` : ""}
            </p>
            <p>
              夕:
              {dayChecked.eveningBefore ? ` 食前 ${dayTimes.eveningBefore}` : ""}
              {dayChecked.eveningAfter ? ` 食後 ${dayTimes.eveningAfter}` : ""}
            </p>
            <p>就寝前: {dayTimes.beforeBed}</p>
          </div>
        );
      })}
      <button onClick={() => navigate("/")}>戻る</button>
    </div>
  );
};

export default SavedPage;
