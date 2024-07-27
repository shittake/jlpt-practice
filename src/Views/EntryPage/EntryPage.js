import { Routes, Route, BrowserRouter } from "react-router-dom";
import { VocabularyPage, VocabularyTestPage } from "../Vocabulary";

const EntryPage = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<VocabularyPage />} />
        <Route exact path="/vocabulary" element={<VocabularyPage />} />
        <Route exact path="/vocabulary-test" element={<VocabularyTestPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default EntryPage;
