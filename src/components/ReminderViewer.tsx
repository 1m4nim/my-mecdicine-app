// import React, { useState } from "react";
// import { Checkbox, Divider } from "antd";
// import type { CheckboxChangeEvent } from "antd/es/checkbox";

// const ReminderViewer: React.FC = () => {
//   const [checkedValues, setCheckedValues] = useState({
//     朝: { 食前: false, 食後: false },
//     昼: { 食前: false, 食後: false },
//     夕: { 食前: false, 食後: false },
//   });

//   const handleChange = (
//     time: "朝" | "昼" | "夕",
//     type: "食前" | "食後",
//     e: CheckboxChangeEvent
//   ) => {
//     setCheckedValues((prev) => ({
//       ...prev,
//       [time]: {
//         ...prev[time],
//         [type]: e.target.checked,
//       },
//     }));
//   };

//   return (
//     <div style={{ padding: "1rem" }}>
//       {["朝", "昼", "夕"].map((time) => (
//         <div key={time} style={{ marginBottom: "1.5rem" }}>
//           <h3>{time}</h3>
//           <Checkbox
//             checked={checkedValues[time as "朝" | "昼" | "夕"].食前}
//             onChange={(e) => handleChange(time as "朝" | "昼" | "夕", "食前", e)}
//           >
//             食前
//           </Checkbox>
//           <Checkbox
//             checked={checkedValues[time as "朝" | "昼" | "夕"].食後}
//             onChange={(e) => handleChange(time as "朝" | "昼" | "夕", "食後", e)}
//             style={{ marginLeft: "1rem" }}
//           >
//             食後
//           </Checkbox>
//           <Divider />
//         </div>
//       ))}
//       <pre>{JSON.stringify(checkedValues, null, 2)}</pre>
//     </div>
//   );
// };

// export default ReminderViewer;
