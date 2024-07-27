import axios from "axios";
import { useEffect, useState } from "react";
import { HTTP_ENDPOINT_PREFIX } from "../../Constants";
import { Card, Button, Row, Col } from "react-bootstrap";
import { shuffleArray, underlineSegment } from "../../Utils";

const VocabularyTestPage = () => {
  const [vocabularyIdToTermInfoMapping, setVocabularyIdToTermInfoMapping] =
    useState({});
  const [questions, setQuestions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [optionSelected, setOptionSelected] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
      .get(`${HTTP_ENDPOINT_PREFIX}/vocabulary/questions`)
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
  };

  const onProceedToNextQuestion = () => {
    setIsSubmitted(false);
    setOptionSelected(null);
    if (activeQuestion + 1 < questions.length)
      setActiveQuestion(activeQuestion + 1);
  };

  return (
    <>
      <Card className="question-card">
        <Card.Header className="question-header-container">
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>{`Question ${
            activeQuestion + 1
          }`}</div>
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
                  Next
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
                  <div style={{ color: "green" }}>You answered correctly!</div>
                ) : (
                  <div style={{ color: "red" }}>You answered incorrectly</div>
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
                  {questions[activeQuestion].pronunciation ||
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
                  {questions[activeQuestion].notes ||
                    "No translation available"}
                </div>
              </>
            )}
          </Card.Text>
        </Card.Body>
        <Card.Footer>2 days ago</Card.Footer>
      </Card>
    </>
  );
};

export default VocabularyTestPage;
