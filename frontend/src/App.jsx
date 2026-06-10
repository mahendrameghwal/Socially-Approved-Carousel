import { Fragment, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedPage from "./pages/FeedPage";

function App() {
  return (
    <Fragment>
      <Router>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<FeedPage />} />
          </Routes>
        </Suspense>
      </Router>
    </Fragment>
  );
}

export default App;
