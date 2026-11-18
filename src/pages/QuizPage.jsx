import usePageTitle from "@/hooks/usePageTitle";
import { totalQuizQuestions } from "@/data/quiz";
import OrderActivity from "./quiz/OrderActivity";
import MatchActivity from "./quiz/MatchActivity";
import Quiz from "./quiz/Quiz";

export default function QuizPage() {
  usePageTitle("Knowledge Check — RS & IP Guide");

  return (
    <>
      <header className="page-hero">
        <div className="chapter-badge">Both Tracks · Final Check</div>
        <h1>
          Knowledge <span>Check</span>
        </h1>
        <p className="hero-intro">
          {totalQuizQuestions} questions and two warm-up activities spanning
          both tracks — starting with the Introduction, then remote sensing
          fundamentals, digital image processing and the Python workflow.
          Instant feedback, per-topic scoring.
        </p>
      </header>

      <section className="content-section reveal">
        <div className="section-label">Warm-up · RS.0</div>
        <h2 className="section-title">Learning activities</h2>
        <p className="section-intro" style={{ maxWidth: 760 }}>
          Two quick activities from the Introduction chapter. They work the same
          way they did on the chapter page — only the location has changed.
        </p>

        <OrderActivity />
        <MatchActivity />
      </section>

      <section className="content-section reveal">
        <div className="section-label">Knowledge Check</div>
        <h2 className="section-title">Quiz</h2>
        <Quiz />
      </section>
    </>
  );
}
