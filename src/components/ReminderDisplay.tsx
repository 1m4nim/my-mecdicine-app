import React, { useEffect, useState } from "react";
import { Button, Table, Typography, Spin } from "antd";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Firebaseの初期化済みファイル
import dayjs from "dayjs";

const { Title } = Typography;

const daysOfWeek = ["月", "火", "水", "木", "金", "土", "日"];

type Reminder = {
  朝?: { enabled: boolean; 食前?: string | null; 食後?: string | null };
  昼?: { enabled: boolean; 食前?: string | null; 食後?: string | null };
  夕?: { enabled: boolean; 食前?: string | null; 食後?: string | null };
  就寝前?: { enabled: boolean; time?: string | null };
};

type WeekReminders = {
  [key: string]: Reminder;
};

const ReminderDisplay: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState("月");
  const [allReminders, setAllReminders] = useState<WeekReminders>({});
  const [loading, setLoading] = useState(true);
  const [useSame, setUseSame] = useState(false);

  useEffect(() => {
    const fetchReminders = async () => {
      const docRef = doc(db, "reminders", "user_reminders");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as { weekData: WeekReminders };
        setAllReminders(data.weekData || {});
      }

      setLoading(false);
    };

    fetchReminders();
  }, []);

  const getDisplayData = () => {
    const dayToShow = useSame ? "月" : selectedDay;
    const reminder = allReminders[dayToShow];

    if (!reminder) return [];

    const rows = [
      {
        key: "朝",
        項目: "朝",
        食前: reminder.朝?.食前 ?? "-",
        食後: reminder.朝?.食後 ?? "-"
      },
      {
        key: "昼",
        項目: "昼",
        食前: reminder.昼?.食前 ?? "-",
        食後: reminder.昼?.食後 ?? "-"
      },
      {
        key: "夕",
        項目: "夕",
        食前: reminder.夕?.食前 ?? "-",
        食後: reminder.夕?.食後 ?? "-"
      },
      {
        key: "就寝前",
        項目: "就寝前",
        食前: reminder.就寝前?.time ?? "-",
        食後: "-"
      }
    ];

    return rows;
  };

  const columns = [
    {
      title: "項目",
      dataIndex: "項目",
      key: "項目",
      render: (text: string) => <span style={{ color: "black" }}>{text}</span>
    },
    {
      title: "食前",
      dataIndex: "食前",
      key: "食前",
      render: (text: string) => <span style={{ color: "black" }}>{text}</span>
    },
    {
      title: "食後",
      dataIndex: "食後",
      key: "食後",
      render: (text: string) => <span style={{ color: "black" }}>{text}</span>
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ textAlign: "center" }}>
        服薬リマインダー表示
      </Title>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
        {daysOfWeek.map((day) => (
          <Button
            key={day}
            type={!useSame && selectedDay === day ? "primary" : "default"}
            onClick={() => {
              setSelectedDay(day);
              setUseSame(false);
            }}
          >
            {day}
          </Button>
        ))}
        <Button type={useSame ? "primary" : "default"} danger onClick={() => setUseSame(true)}>
          全部同じ
        </Button>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={getDisplayData()}
          columns={columns}
          pagination={false}
          bordered
          style={{ color: "black" }}
        />
      )}
    </div>
  );
};

export default ReminderDisplay;
