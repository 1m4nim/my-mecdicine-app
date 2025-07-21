import React, { useState, useEffect } from "react";
import TimePicker from "react-time-picker";
import { Checkbox, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

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

const adjustTimeByWheel = (current: string, deltaY: number): string => {
  const [h, m] = current?.split(":").map(Number) ?? [0, 0];
  let totalMinutes = h * 60 + m;
  const increment = deltaY < 0 ? 1 : -1;
  totalMinutes = (totalMinutes + increment + 1440) % 1440;
  const newHour = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const newMinute = (totalMinutes % 60).toString().padStart(2, "0");
  return `${newHour}:${newMinute}`;
};

const ReminderFormWithPrompt: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState("月");

  const emptyTimes = Object.fromEntries(
    daysOfWeek.map((day) => [
      day,
      {
        morningBefore: "",
        morningAfter: "",
        afternoonBefore: "",
        afternoonAfter: "",
        eveningBefore: "",
        eveningAfter: "",
        beforeBed: "",
      },
    ])
  );

  const emptyChecked = Object.fromEntries(
    daysOfWeek.map((day) => [
      day,
      {
        morningBefore: false,
        morningAfter: false,
        afternoonBefore: false,
        afternoonAfter: false,
        eveningBefore: false,
        eveningAfter: false,
        beforeBed: false,
      },
    ])
  );

  const [times, setTimes] = useState(emptyTimes);
  const [checked, setChecked] = useState(emptyChecked);

  useEffect(() => {
    const saved = localStorage.getItem("reminderData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.times && parsed.checked) {
          setTimes(parsed.times);
          setChecked(parsed.checked);
        }
      } catch {
        // JSON parse error
      }
    }
  }, []);

  const handleCopyToAllDays = () => {
    const baseTimes = times[selectedDay];
    const baseChecked = checked[selectedDay];
    const newTimes = { ...times };
    const newChecked = { ...checked };
    daysOfWeek.forEach((day) => {
      newTimes[day] = { ...baseTimes };
      newChecked[day] = { ...baseChecked };
    });
    setTimes(newTimes);
    setChecked(newChecked);
  };

  const handleTimeChange = (
    timeKey: keyof (typeof times)["月"],
    time: string
  ) => {
    setTimes((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [timeKey]: time,
      },
    }));
  };

  const handleCheckboxChange = (
    key: keyof (typeof checked)["月"],
    value: boolean
  ) => {
    setChecked((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [key]: value,
      },
    }));
  };

  const isAnyTimeSelected = (): boolean => {
    for (const day of daysOfWeek) {
      const dayChecked = checked[day];
      if (
        dayChecked.morningBefore ||
        dayChecked.morningAfter ||
        dayChecked.afternoonBefore ||
        dayChecked.afternoonAfter ||
        dayChecked.eveningBefore ||
        dayChecked.eveningAfter ||
        dayChecked.beforeBed
      ) {
        return true;
      }
    }
    return false;
  };

  const handleSave = () => {
    if (!isAnyTimeSelected()) {
      alert("少なくとも1つは食前・食後の時間を選択してください。");
      return;
    }
    localStorage.setItem("reminderData", JSON.stringify({ times, checked }));
    navigate("/saved", { state: { times, checked } });
  };

  const renderTimePicker = (timeKey: keyof (typeof times)["月"]) => (
    <TimePicker
      value={times[selectedDay][timeKey]}
      onChange={(time) => {
        if (typeof time === "string") {
          handleTimeChange(timeKey, time);
        }
      }}
      disableClock
      format="HH:mm"
      clearIcon={null}
      onWheel={(e) => {
        e.preventDefault();
        const current = times[selectedDay][timeKey] || "00:00";
        const next = adjustTimeByWheel(current, e.deltaY);
        handleTimeChange(timeKey, next);
      }}
    />
  );

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
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <Checkbox
          checked={checked[selectedDay][beforeKey]}
          onChange={(e) => handleCheckboxChange(beforeKey, e.target.checked)}
        >
          食前
        </Checkbox>
        {checked[selectedDay][beforeKey] && (
          <div style={{ marginLeft: 16 }}>{renderTimePicker(beforeKey)}</div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Checkbox
          checked={checked[selectedDay][afterKey]}
          onChange={(e) => handleCheckboxChange(afterKey, e.target.checked)}
        >
          食後
        </Checkbox>
        {checked[selectedDay][afterKey] && (
          <div style={{ marginLeft: 16 }}>{renderTimePicker(afterKey)}</div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 曜日選択＋毎日同じです */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 16,
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
        <Button
          style={{ marginLeft: 12 }}
          onClick={handleCopyToAllDays}
          type="dashed"
        >
          毎日同じです
        </Button>
      </div>

      {/* 時間セット */}
      {renderTimeSet("朝", "morningBefore", "morningAfter")}
      {renderTimeSet("昼", "afternoonBefore", "afternoonAfter")}
      {renderTimeSet("夕", "eveningBefore", "eveningAfter")}

      {/* 就寝前 */}
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
          就寝前
        </Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={checked[selectedDay].beforeBed}
            onChange={(e) => handleCheckboxChange("beforeBed", e.target.checked)}
          >
            ←押すと時間が選べるよ
          </Checkbox>
          {checked[selectedDay].beforeBed && (
            <div style={{ marginLeft: 16 }}>
              <TimePicker
                value={times[selectedDay].beforeBed}
                onChange={(time) => {
                  if (typeof time === "string") {
                    setTimes((prev) => ({
                      ...prev,
                      [selectedDay]: {
                        ...prev[selectedDay],
                        beforeBed: time,
                      },
                    }));
                  }
                }}
                disableClock
                format="HH:mm"
                clearIcon={null}
                onWheel={(e) => {
                  e.preventDefault();
                  const current = times[selectedDay].beforeBed || "00:00";
                  const next = adjustTimeByWheel(current, e.deltaY);
                  setTimes((prev) => ({
                    ...prev,
                    [selectedDay]: {
                      ...prev[selectedDay],
                      beforeBed: next,
                    },
                  }));
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 保存ボタン */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        <Button type="primary" onClick={handleSave}>
          保存
        </Button>
      </div>
    </>
  );
};

export default ReminderFormWithPrompt;
