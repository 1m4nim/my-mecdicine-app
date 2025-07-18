// ReminderViewer.tsx
import React, { useEffect, useState } from "react";
import { Button, Table, Space, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const { Title } = Typography;

type TimeSetting = {
  enabled: boolean;
  食前?: string | null;
  食後?: string | null;
  time?: string | null;
};

type DayReminder = {
  朝: TimeSetting;
  昼: TimeSetting;
  夕: TimeSetting;
  就寝前: TimeSetting;
};

const weekDays = ["月", "火", "水", "木", "金", "土", "日"];

const ReminderViewer = () => {
  const [selectedDay, setSelectedDay] = useState("月");
  const [allSame, setAllSame] = useState(false);
  const [reminders, setReminders] = useState<Record<string, DayReminder>>({});

  const fetchReminders = async () => {
    const docRef = doc(db, "reminders", "user1");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setReminders(snapshot.data() as Record<string, DayReminder>);
    } else {
      message.warning("リマインダー設定が見つかりません");
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const current = allSame ? reminders["月"] : reminders[selectedDay];

  const dataSource = current
    ? [
        {
          key: "朝",
          category: "朝",
          食前: current.朝.enabled ? current.朝.食前 || "-" : "-",
          食後: current.朝.enabled ? current.朝.食後 || "-" : "-",
        },
        {
          key: "昼",
          category: "昼",
          食前: current.昼.enabled ? current.昼.食前 || "-" : "-",
          食後: current.昼.enabled ? current.昼.食後 || "-" : "-",
        },
        {
          key: "夕",
          category: "夕",
          食前: current.夕.enabled ? current.夕.食前 || "-" : "-",
          食後: current.夕.enabled ? current.夕.食後 || "-" : "-",
        },
        {
          key: "就寝前",
          category: "就寝前",
          食前: "-",
          食後: current.就寝前.enabled ? current.就寝前.time || "-" : "-",
        },
      ]
    : [];

  const columns: ColumnsType<typeof dataSource[0]> = [
    { title: "項目", dataIndex: "category", key: "category" },
    { title: "食前", dataIndex: "食前", key: "食前" },
    { title: "食後", dataIndex: "食後", key: "食後" },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={3}>服薬リマインダー確認</Title>
      <Space style={{ marginBottom: "1rem" }}>
        {weekDays.map(day => (
          <Button
            key={day}
            type={selectedDay === day && !allSame ? "primary" : "default"}
            onClick={() => {
              setSelectedDay(day);
              setAllSame(false);
            }}
          >
            {day}
          </Button>
        ))}
        <Button
          type={allSame ? "primary" : "default"}
          onClick={() => setAllSame(true)}
        >
          全部同じ
        </Button>
      </Space>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default ReminderViewer;
