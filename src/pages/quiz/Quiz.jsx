import { useEffect, useRef, useState } from "react";
import { quizTopics, totalQuizQuestions } from "@/data/quiz";

let cursor = 0;
const TOPICS = quizTopics.map((topic) => {
  const start = cursor;
  cursor += topic.questions.length;
  return { ...topic, start };
});

export default function Quiz() {
  const [answers, setAnswers] = useState(() =>
    Array(totalQuizQuestions).fill(null),
  );
  const [showScore, setShowScore] = useState(false);
  const scoreRef = useRef(null);

  const answer = (questionIndex, optionIndex) => {
    setAnswers((current) => {
      if (current[questionIndex] !== null) return current;
      const next = current.slice();
      next[questionIndex] = optionIndex;
      return next;
    });
  };

  const answeredCount = answers.filter((value) => value !== null).length;
  const correctCount = answers.reduce((total, answerIndex, questionIndex) => {
    if (answerIndex === null) return total;
    const question = TOPICS.flatMap((topic) => topic.questions)[questionIndex];
    return total + (answerIndex === question.correct ? 1 : 0);
  }, 0);
  const allAnswered = answeredCount === totalQuizQuestions;

  useEffect(() => {
    if (!allAnswered) {
      setShowScore(false);
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowScore(true);
      scoreRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 500);

    return () => clearTimeout(timer);
  }, [allAnswered]);

  const topicStats = (topic) => {
    let answered = 0;
    let correct = 0;
    topic.questions.forEach((question, index) => {
      const selected = answers[topic.start + index];
      if (selected !== null) {
        answered += 1;
        if (selected === question.correct) correct += 1;
      }
    });
    return { answered, correct };
  };

  return (
    <div className="quiz-section" id="quiz-container">
      {TOPICS.map((topic, topicIndex) => {
        const stats = topicStats(topic);
        const complete = stats.answered === topic.questions.length;
        return (
          <div key={topic.title}>
            <div className="quiz-topic-header">
              <div className="topic-num">
                Topic {topicIndex + 1} of {TOPICS.length}
              </div>
              <div className="topic-title">{topic.title}</div>
              <div className="topic-desc">{topic.desc}</div>
              <div
                className="topic-progress"
                style={
                  complete
                    ? {
                        color:
                          stats.correct === topic.questions.length
                            ? "var(--green)"
                            : "var(--amber)",
                      }
                    : undefined
                }
              >
                {complete
                  ? `${stats.correct}/${topic.questions.length} correct`
                  : `${stats.answered}/${topic.questions.length} answered`}
              </div>
            </div>

            {topic.questions.map((question, localIndex) => {
              const questionIndex = topic.start + localIndex;
              const selected = answers[questionIndex];
              const answered = selected !== null;
              return (
                <div className="quiz-question" key={questionIndex}>
                  <div className="q-num">
                    Question {questionIndex + 1} of {totalQuizQuestions}
                  </div>
                  <div className="q-text">{question.q}</div>
                  <div className="quiz-options">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect =
                        answered && optionIndex === question.correct;
                      const isWrong =
                        answered &&
                        optionIndex === selected &&
                        selected !== question.correct;
                      const marker =
                        !answered || (!isCorrect && !isWrong)
                          ? String.fromCharCode(65 + optionIndex)
                          : isCorrect
                            ? "✓"
                            : "✗";
                      return (
                        <div
                          className={`quiz-option${answered ? " disabled" : ""}${isCorrect ? " correct" : ""}${isWrong ? " wrong" : ""}`}
                          key={optionIndex}
                          onClick={() => answer(questionIndex, optionIndex)}
                        >
                          <div className="marker">{marker}</div>
                          <span>{option}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className={`quiz-feedback${answered ? " show" : ""}`}
                    id={`feedback-${questionIndex}`}
                  >
                    {question.feedback}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      <div
        ref={scoreRef}
        className={`quiz-score${showScore ? " show" : ""}`}
        id="quiz-score"
      >
        You scored <span className="score-num">{correctCount}</span> /{" "}
        {totalQuizQuestions}
        <br />
        <span
          style={{
            fontSize: 13,
            color: "var(--text-dim)",
            marginTop: 8,
            display: "block",
          }}
        >
          Revisit any chapter you're unsure of — both tracks link back and forth
          constantly.
        </span>
      </div>
    </div>
  );
}
