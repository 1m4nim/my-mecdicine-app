import React, { useState } from "react";
import { Checkbox, TimePicker, Typography, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ja";

dayjs.locale("ja");

const { Title } = Typography;

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

const ReminderFormWithPrompt = () => {
  const [selectedDay, setSelectedDay] = useState("月");

  const [times, setTimes] = useState<{
    [day: string]: {
      morningBefore: Dayjs | null;
      morningAfter: Dayjs | null;
      afternoonBefore: Dayjs | null;
      afternoonAfter: Dayjs | null;
      eveningBefore: Dayjs | null;
      eveningAfter: Dayjs | null;
      beforeBed: Dayjs | null;
    };
  }>(() =>
    Object.fromEntries(
      daysOfWeek.map((day) => [
        day,
        {
          morningBefore: null,
          morningAfter: null,
          afternoonBefore: null,
          afternoonAfter: null,
          eveningBefore: null,
          eveningAfter: null,
          beforeBed: null,
        },
      ])
    )
  );

  const [checked, setChecked] = useState<{
    [day: string]: {
      morningBefore: boolean;
      morningAfter: boolean;
      afternoonBefore: boolean;
      afternoonAfter: boolean;
      eveningBefore: boolean;
      eveningAfter: boolean;
    };
  }>(() =>
    Object.fromEntries(
      daysOfWeek.map((day) => [
        day,
        {
          morningBefore: false,
          morningAfter: false,
          afternoonBefore: false,
          afternoonAfter: false,
          eveningBefore: false,
          eveningAfter: false,
        },
      ])
    )
  );

  // 保存したデータ
  const [savedData, setSavedData] = useState<{
    times: typeof times;
    checked: typeof checked;
  } | null>(null);

  // 時間変更ハンドラ
  const handleTimeChange = (
    timeKey: keyof (typeof times)["月"],
    time: Dayjs | null
  ) => {
    setTimes({
      ...times,
      [selectedDay]: {
        ...times[selectedDay],
        [timeKey]: time,
      },
    });
  };

  // チェックボックス変更ハンドラ
  const handleCheckboxChange = (
    key: keyof (typeof checked)["月"],
    value: boolean
  ) => {
    setChecked({
      ...checked,
      [selectedDay]: {
        ...checked[selectedDay],
        [key]: value,
      },
    });
  };

  // 保存ボタン押下
  const handleSave = () => {
    setSavedData({
      times,
      checked,
    });
  };

  // 削除ボタン押下（保存データクリア）
  const handleDelete = () => {
    setSavedData(null);
  };

  // 時間設定UIを描画
  const renderTimeSet = (
    label: string,
    beforeKey: keyof (typeof times)["月"],
    afterKey: keyof (typeof times)["月"]
  ) => (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
        color: "black",
      }}
    >
      <Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>
        {label}
      </Title>

      {/* 食前 */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <Checkbox
          checked={checked[selectedDay][beforeKey]}
          onChange={(e) => handleCheckboxChange(beforeKey, e.target.checked)}
        >
          食前
        </Checkbox>
        {checked[selectedDay][beforeKey] && (
          <TimePicker
            value={times[selectedDay][beforeKey]}
            onChange={(time) => handleTimeChange(beforeKey, time)}
            format="HH:mm"
            style={{ marginLeft: 16 }}
          />
        )}
      </div>

      {/* 食後 */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Checkbox
          checked={checked[selectedDay][afterKey]}
          onChange={(e) => handleCheckboxChange(afterKey, e.target.checked)}
        >
          食後
        </Checkbox>
        {checked[selectedDay][afterKey] && (
          <TimePicker
            value={times[selectedDay][afterKey]}
            onChange={(time) => handleTimeChange(afterKey, time)}
            format="HH:mm"
            style={{ marginLeft: 16 }}
          />
        )}
      </div>
    </div>
  );

  // 保存されたリマインダー表示コンポーネント
  const RenderSavedData = ({
    data,
    onDelete,
  }: {
    data: { times: typeof times; checked: typeof checked };
    onDelete: () => void;
  }) => {
    return (
      <div
        style={{
          marginTop: 32,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 8,
          backgroundColor: "#fafafa",
          maxWidth: 450,
          marginLeft: "auto",
          marginRight: "auto",
          position: "relative",
        }}
      >
        {/* 削除ボタンを右上に配置 */}
        <Button
          danger
          size="small"
          onClick={onDelete}
          style={{ position: "absolute", top: 8, right: 8 }}
        >
          削除
        </Button>

        <Title level={4} style={{ marginBottom: 24, textAlign: "center" }}>
          保存されたリマインダー内容
        </Title>

        {daysOfWeek.map((day) => {
          const dayTimes = data.times[day];
          const dayChecked = data.checked[day];

          const hasData =
            dayChecked.morningBefore ||
            dayChecked.morningAfter ||
            dayChecked.afternoonBefore ||
            dayChecked.afternoonAfter ||
            dayChecked.eveningBefore ||
            dayChecked.eveningAfter ||
            dayTimes.beforeBed !== null;

          if (!hasData) return null;

          return (
            <div
              key={day}
              style={{
                marginBottom: 20,
                borderBottom: "1px solid #ddd",
                paddingBottom: 10,
              }}
            >
              <Title
                level={5}
                style={{ color: dayColors[day], marginBottom: 12 }}
              >
                {day}曜日
              </Title>

              {(dayChecked.morningBefore || dayChecked.morningAfter) && (
                <div>
                  <strong>朝: </strong>
                  {dayChecked.morningBefore &&
                    `食前 ${dayTimes.morningBefore?.format("HH:mm") || ""} `}
                  {dayChecked.morningAfter &&
                    `食後 ${dayTimes.morningAfter?.format("HH:mm") || ""}`}
                </div>
              )}

              {(dayChecked.afternoonBefore || dayChecked.afternoonAfter) && (
                <div>
                  <strong>昼: </strong>
                  {dayChecked.afternoonBefore &&
                    `食前 ${dayTimes.afternoonBefore?.format("HH:mm") || ""} `}
                  {dayChecked.afternoonAfter &&
                    `食後 ${dayTimes.afternoonAfter?.format("HH:mm") || ""}`}
                </div>
              )}

              {(dayChecked.eveningBefore || dayChecked.eveningAfter) && (
                <div>
                  <strong>夕: </strong>
                  {dayChecked.eveningBefore &&
                    `食前 ${dayTimes.eveningBefore?.format("HH:mm") || ""} `}
                  {dayChecked.eveningAfter &&
                    `食後 ${dayTimes.eveningAfter?.format("HH:mm") || ""}`}
                </div>
              )}

              {dayTimes.beforeBed && (
                <div>
                  <strong>就寝前: </strong> {dayTimes.beforeBed.format("HH:mm")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* 右上に固定の保存ボタン */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        <Button type="primary" onClick={handleSave}>
          保存
        </Button>
      </div>

      <div style={{ maxWidth: 450, margin: "0 auto", padding: "24px" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: "16px",
            marginTop: "6rem",
            lineHeight: 1,
          }}
        >
          {daysOfWeek.map((day) => (
            <Button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                margin: "0 4px 8px",
                backgroundColor: selectedDay === day ? "#e6f7ff" : "#fff",
                fontWeight: selectedDay === day ? "bold" : undefined,
                color: dayColors[day],
              }}
            >
              {day}
            </Button>
          ))}
        </div>

        {renderTimeSet("朝", "morningBefore", "morningAfter")}
        {renderTimeSet("昼", "afternoonBefore", "afternoonAfter")}
        {renderTimeSet("夕", "eveningBefore", "eveningAfter")}

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
            color: "black",
          }}
        >
          <Title level={5} style={{ marginTop: 0, marginBottom: 0 }}>
            就寝前
          </Title>
          <TimePicker
            value={times[selectedDay].beforeBed}
            onChange={(time) => handleTimeChange("beforeBed", time)}
            format="HH:mm"
          />
        </div>
      </div>

      {/* 保存データがあれば表示 */}
      {savedData && (
        <RenderSavedData data={savedData} onDelete={handleDelete} />
      )}
    </>
  );
};

export default ReminderFormWithPrompt;
