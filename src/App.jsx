import { lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SiteLayout from "@/layout/SiteLayout";
import NotFoundPage from "@/pages/NotFoundPage";
import { LEGACY_ROUTES } from "@/data/course";

const HomePage = lazy(() => import("@/pages/HomePage"));
const IntroPage = lazy(() => import("@/pages/remote-sensing/IntroPage"));
const FundamentalsPage = lazy(
  () => import("@/pages/remote-sensing/FundamentalsPage"),
);
const SignaturesPage = lazy(
  () => import("@/pages/remote-sensing/SignaturesPage"),
);
const PlatformsPage = lazy(
  () => import("@/pages/remote-sensing/PlatformsPage"),
);
const ResolutionPage = lazy(
  () => import("@/pages/remote-sensing/ResolutionPage"),
);
const InterpretationPage = lazy(
  () => import("@/pages/remote-sensing/InterpretationPage"),
);
const MissionsDataPage = lazy(
  () => import("@/pages/remote-sensing/MissionsDataPage"),
);
const BasicsPage = lazy(() => import("@/pages/image-processing/BasicsPage"));
const PreprocessingPage = lazy(
  () => import("@/pages/image-processing/PreprocessingPage"),
);
const EnhancementPage = lazy(
  () => import("@/pages/image-processing/EnhancementPage"),
);
const ClassificationPage = lazy(
  () => import("@/pages/image-processing/ClassificationPage"),
);
const PythonLabPage = lazy(
  () => import("@/pages/image-processing/PythonLabPage"),
);
const ApplicationsPage = lazy(() => import("@/pages/ApplicationsPage"));
const QuizPage = lazy(() => import("@/pages/QuizPage"));

function LegacyRedirect() {
  const { pathname } = useLocation();
  const destination = LEGACY_ROUTES[pathname];

  if (!destination) return <NotFoundPage />;
  return <Navigate to={destination} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="remote-sensing">
          <Route path="intro" element={<IntroPage />} />
          <Route path="fundamentals" element={<FundamentalsPage />} />
          <Route path="signatures" element={<SignaturesPage />} />
          <Route path="platforms" element={<PlatformsPage />} />
          <Route path="resolution" element={<ResolutionPage />} />
          <Route path="interpretation" element={<InterpretationPage />} />
          <Route path="missions-data" element={<MissionsDataPage />} />
        </Route>
        <Route path="image-processing">
          <Route path="basics" element={<BasicsPage />} />
          <Route path="preprocessing" element={<PreprocessingPage />} />
          <Route path="enhancement" element={<EnhancementPage />} />
          <Route path="classification" element={<ClassificationPage />} />
          <Route path="python-lab" element={<PythonLabPage />} />
        </Route>
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="index.html" element={<Navigate to="/" replace />} />
        <Route path="pages/*" element={<LegacyRedirect />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
