import { Tabs, Tab, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircle } from "@fortawesome/free-solid-svg-icons";

const OverviewPage = () => {
  const levels = [
    { id: 1, title: "Level 1" },
    { id: 2, title: "Level 2" },
    { id: 3, title: "Level 3" },
    { id: 4, title: "Level 4" },
    { id: 5, title: "Level 5" },
  ];

  const currentLevel = 3;

  return (
    <>
      <Tabs
        defaultActiveKey="vocabulary"
        id="uncontrolled-tab-example"
        className="mb-3 nav-justified custom-tabs"
      >
        <Tab eventKey="vocabulary" title="Vocabulary">
          <div>
            <h3 style={{ marginBottom: "20px" }}>Vocabulary Roadmap</h3>
            <Container>
              <Row className="justify-content-between align-items-center roadmap">
                {levels.map((level, index) => (
                  <Col key={level.id} className="text-center roadmap-level">
                    <div
                      className={`level-icon ${
                        currentLevel >= level.id ? "completed" : ""
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={
                          currentLevel >= level.id ? faCheckCircle : faCircle
                        }
                        size="2x"
                      />
                    </div>
                    <div className="level-title mt-2">{level.title}</div>
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
        </Tab>
        <Tab eventKey="grammar" title="Grammar">
          <div>
            <h3>Grammar Roadmap</h3>
          </div>
        </Tab>
        <Tab eventKey="reading" title="Reading">
          <div>
            <h3>Reading Roadmap</h3>
          </div>
        </Tab>
        <Tab eventKey="listening" title="Listening">
          <div>
            <h3>Listening Roadmap</h3>
          </div>
        </Tab>
      </Tabs>
    </>
  );
};

export default OverviewPage;
