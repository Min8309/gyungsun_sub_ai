import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import JukcheomjeongDetailPage from "./pages/JukcheomjeongDetailPage";
import MariaDetailPage from "./pages/MariaDetailPage";
import SonkijeongDetailPage from "./pages/SonkijeongDetailPage";
import BaekbaekgyoDetailPage from "./pages/BaekbaekgyoDetailPage";

import Newsroom, { NewsList, ArticlePage } from "./pages/Newsroom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Newsroom />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/articles/:id" element={<ArticlePage />} />
        <Route
          path="/"
          element={<Navigate to="/case/jukcheomjeong" replace />}
        />

        <Route
          path="/case/jukcheomjeong"
          element={<JukcheomjeongDetailPage />}
        />

        <Route
          path="/case/maria"
          element={<MariaDetailPage />}
        />

        <Route
          path="/case/sonkijeong"
          element={<SonkijeongDetailPage />}
        />

        <Route
          path="/case/baekbaekgyo"
          element={<BaekbaekgyoDetailPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;