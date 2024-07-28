import axios from "axios";
import { useEffect, useState } from "react";
import { HTTP_ENDPOINT_PREFIX } from "../../Constants";
import { Card, Button, Row, Col, ProgressBar } from "react-bootstrap";
import { shuffleArray, underlineSegment } from "../../Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faTrophy } from "@fortawesome/free-solid-svg-icons";

const VocabularyTestPage = ({ setNumber = 1 }) => {
  const [vocabularyIdToTermInfoMapping, setVocabularyIdToTermInfoMapping] =
    useState({});
  const [questions, setQuestions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [optionSelected, setOptionSelected] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [isSummaryPage, setIsSummaryPage] = useState(false);
  const [options, setOptions] = useState([]);

  const getVocabularyTerms = () => {
    axios.get(`${HTTP_ENDPOINT_PREFIX}/vocabulary`).then((response) => {
      let mapping = {};
      for (const vocab of response.data) {
        mapping[vocab["vocabulary_id"]] = vocab;
      }
      setVocabularyIdToTermInfoMapping(mapping);
    });
  };

  const getVocabularyQuestions = () => {
    axios
      .get(`${HTTP_ENDPOINT_PREFIX}/vocabulary/questions?set=${setNumber}`)
      .then((response) => {
        setQuestions(response.data);
      });
  };

  const generateOptions = (currentQuestionIndex) => {
    setOptions(
      shuffleArray(
        vocabularyIdToTermInfoMapping[
          questions?.[currentQuestionIndex]?.["vocabulary_id_used"]
        ]?.options || []
      )
    );
  };

  useEffect(() => {
    getVocabularyTerms();
    getVocabularyQuestions();
  }, []);

  useEffect(() => {
    generateOptions(activeQuestion);
  }, [vocabularyIdToTermInfoMapping, questions, activeQuestion]);

  const onSubmitQuestion = () => {
    setIsSubmitted(true);
    if (isCorrect) setCorrectAnswersCount(correctAnswersCount + 1);
    else setMistakesCount(mistakesCount + 1);
  };

  const onProceedToNextQuestion = () => {
    setIsSubmitted(false);
    setOptionSelected(null);
    if (activeQuestion + 1 < questions.length)
      setActiveQuestion(activeQuestion + 1);
    else setIsSummaryPage(true);
  };

  return (
    <>
      <Card className="question-card">
        <ProgressBar
          style={{
            display: "flex",
            justifyContent: "left",
            width: "100%",
            margin: "0 auto",
            height: "20px",
          }}
          now={((activeQuestion + 1) * 100) / questions.length}
          label={`Q${activeQuestion + 1}`}
          variant="success"
        />
        {!isSummaryPage ? (
          <>
            <Card.Header className="question-header-container">
              <div
                style={{ fontSize: "24px", fontWeight: "bold" }}
              >{`Question ${activeQuestion + 1} of ${questions.length}`}</div>
              {optionSelected !== null && (
                <>
                  {!isSubmitted ? (
                    <Button
                      className="question-submit-button"
                      variant="primary"
                      onClick={onSubmitQuestion}
                    >
                      Check
                    </Button>
                  ) : (
                    <Button
                      className="question-submit-button"
                      variant="primary"
                      onClick={onProceedToNextQuestion}
                    >
                      {`${
                        activeQuestion === questions.length - 1
                          ? "Finish"
                          : "Next"
                      }`}
                    </Button>
                  )}
                </>
              )}
            </Card.Header>
            <Card.Body>
              <Card.Text style={{ textAlign: "left", fontSize: "20px" }}>
                {underlineSegment(
                  questions?.[activeQuestion]?.sentence || "",
                  vocabularyIdToTermInfoMapping[
                    questions?.[activeQuestion]?.["vocabulary_id_used"]
                  ]?.term || ""
                )}
              </Card.Text>
              <Card.Text>
                {!isSubmitted ? (
                  <Row>
                    {options.map((option, index) => (
                      <Col key={index} md={6} className="mb-3">
                        <Button
                          className={`options-button ${
                            optionSelected === option ? "selected" : ""
                          }`}
                          variant="outline-primary"
                          size="lg"
                          onClick={() => {
                            setOptionSelected(option);
                            setIsCorrect(
                              option ===
                                (vocabularyIdToTermInfoMapping[
                                  questions?.[activeQuestion]?.[
                                    "vocabulary_id_used"
                                  ]
                                ]?.["correct_ans"] || "")
                            );
                          }}
                        >
                          {option}
                        </Button>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <>
                    {isCorrect ? (
                      <div style={{ color: "green" }}>
                        You answered correctly!
                      </div>
                    ) : (
                      <div style={{ color: "red" }}>
                        You answered incorrectly
                      </div>
                    )}
                    <div style={{ fontSize: "24px", marginTop: "10px" }}>
                      {
                        vocabularyIdToTermInfoMapping[
                          questions?.[activeQuestion]?.["vocabulary_id_used"]
                        ]?.["correct_ans"]
                      }
                    </div>
                    <div style={{ fontSize: "36px" }}>
                      {
                        vocabularyIdToTermInfoMapping[
                          questions?.[activeQuestion]?.["vocabulary_id_used"]
                        ]?.term
                      }
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        fontWeight: "bold",
                        marginTop: "10px",
                      }}
                    >
                      Sentence pronunciation:
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      {questions[activeQuestion]?.pronunciation ||
                        "No pronunciation available"}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        fontWeight: "bold",
                        marginTop: "10px",
                      }}
                    >
                      English translation:
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      {questions[activeQuestion]?.notes ||
                        "No translation available"}
                    </div>
                  </>
                )}
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <div
                style={{
                  color: "green",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ marginRight: "8px" }}
                />
                {`${correctAnswersCount} correct ${
                  correctAnswersCount !== 1 ? "answers" : "answer"
                }`}
              </div>
              <div
                style={{ color: "red", display: "flex", alignItems: "center" }}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{ marginRight: "8px" }}
                />
                {`${mistakesCount} ${
                  mistakesCount !== 1 ? "mistakes" : "mistake"
                }`}
              </div>
            </Card.Footer>
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faTrophy}
              style={{
                marginTop: "16px",
                marginBottom: "16px",
                size: "100px",
                color: "gold",
                fontSize: "64px",
              }}
            />
            <div
              style={{
                color: "#FFA833",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {`You got ${correctAnswersCount} correct answers, which is higher than the target of 12!`}
            </div>
            <p>
              You have earned{" "}
              <span
                style={{
                  color: "green",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                10 XP
              </span>{" "}
              for your efforts and have unlocked the next set - Set{" "}
              {setNumber + 1}!
            </p>
            <div>
              Here is a summary of all the sample sentences used in this set:
              <hr />
              {questions.map((question, index) => {
                return (
                  <>
                    <div
                      style={{
                        marginTop: "10px",
                      }}
                    >{`${index + 1}. ${question.sentence}`}</div>
                    <div>{question.notes}</div>
                    <hr />
                  </>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </>
  );
};

export default VocabularyTestPage;
