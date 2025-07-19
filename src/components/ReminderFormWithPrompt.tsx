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

  const handleTimeChange = (
    timeKey: keyof typeof times["月"],
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

  const handleCheckboxChange = (
    key: keyof typeof checked["月"],
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

  const renderTimeSet = (
    label: string,
    beforeKey: keyof typeof times["月"],
    afterKey: keyof typeof times["月"]
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
      <Title level={5}>{label}</Title>
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
          style={{ display: "block", marginTop: 8 }}
        />
      )}

      <Checkbox
        checked={checked[selectedDay][afterKey]}
        onChange={(e) => handleCheckboxChange(afterKey, e.target.checked)}
        style={{ marginTop: 12 }}
      >
        食後
      </Checkbox>
      {checked[selectedDay][afterKey] && (
        <TimePicker
          value={times[selectedDay][afterKey]}
          onChange={(time) => handleTimeChange(afterKey, time)}
          format="HH:mm"
          style={{ display: "block", marginTop: 8 }}
        />
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 450, margin: "0 auto", padding: "24px" }}>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
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
        <Title level={5}>就寝前</Title>
        <TimePicker
          value={times[selectedDay].beforeBed}
          onChange={(time) => handleTimeChange("beforeBed", time)}
          format="HH:mm"
        />
      </div>
    </div>
  );
};

export default ReminderFormWithPrompt;
