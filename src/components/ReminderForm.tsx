// import React, { useState } from "react";
// import { Checkbox, Button } from "antd";

// const MealTimes = ["朝", "昼", "夕"] as const;
// type MealTime = typeof MealTimes[number];

// type CheckedState = {
//   [key in MealTime]: {
//     before: boolean;
//     after: boolean;
//   };
// };

// const ReminderForm = () => {
//   const [checked, setChecked] = useState<CheckedState>({
//     朝: { before: false, after: false },
//     昼: { before: false, after: false },
//     夕: { before: false, after: false },
//   });

//   const toggleCheck = (time: MealTime, type: "before" | "after") => {
//     setChecked((prev) => ({
//       ...prev,
//       [time]: {
//         ...prev[time],
//         [type]: !prev[time][type],
//       },
//     }));
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: "#f5f0e6",
//         padding: "2rem",
//         borderRadius: "1rem",
//         maxWidth: 320,
//         fontSize: "1.5rem",
//       }}
//     >
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "80px 80px 80px",
//           gap: "1rem",
//           marginBottom: "1rem",
//           fontWeight: "bold",
//           textAlign: "center",
//         }}
//       >
//         <div>項目</div>
//         <div>設定</div>
//         <div>時間</div>
//       </div>

//       {MealTimes.map((time) => (
//         <div
//           key={time}
//           style={{
//             display: "grid",
//             gridTemplateColumns: "80px 80px 80px",
//             alignItems: "center",
//             marginBottom: "1rem",
//           }}
//         >
//           <div>{time}</div>
//           <div>
//             <Checkbox
//               checked={checked[time].before}
//               onChange={() => toggleCheck(time, "before")}
//               style={{ marginRight: 8 }}
//             >
//               食前
//             </Checkbox>
//             <Checkbox
//               checked={checked[time].after}
//               onChange={() => toggleCheck(time, "after")}
//             >
//               食後
//             </Checkbox>
//           </div>
//           <div>
//           </div>
//         </div>
//       ))}

//       <div style={{ marginTop: "2rem" }}>
//         <Button type="primary" style={{ marginRight: "1rem", fontSize: "1.2rem" }}>
//           保存
//         </Button>
//         <Button danger style={{ fontSize: "1.2rem" }}>
//           削除
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ReminderForm;
