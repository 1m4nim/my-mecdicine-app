import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReminderFormWithPrompt from "./components/ReminderFormWithPrompt";
import SavedPage from "./components/SavedPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReminderFormWithPrompt />} />
        <Route path="/saved" element={<SavedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
