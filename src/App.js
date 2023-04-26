import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import { data } from "./Users";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [expandedRows, setExpandedRows] = useState([]);
  const [expandState, setExpandState] = useState({});

  const handleEpandRow = (event, userId) => {
    const currentExpandedRows = expandedRows;
    const isRowExpanded = currentExpandedRows.includes(userId);

    let obj = {};
    isRowExpanded ? (obj[userId] = false) : (obj[userId] = true);
    setExpandState(obj);

    // If the row is expanded, we are here to hide it. Hence remove
    // it from the state variable. Otherwise add to it.
    const newExpandedRows = isRowExpanded
      ? currentExpandedRows.filter((id) => id !== userId)
      : currentExpandedRows.concat(userId);

    setExpandedRows(newExpandedRows);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1> Users({data.length})</h1>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Table responsive>
            <thead style={{ background: "#92eb34" }}>
              <tr>
                <th></th>
                <th>Epic Name</th>
                <th>Epic ID</th>
                <th>Captalize</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <>
                  <tr
                    onClick={(event) => handleEpandRow(event, user.id)}
                    key={user.id}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <img src={user["photo"]} alt="" />
                    </td>
                    <td>{user["project_name"]}</td>
                    <td>{user["project_id"]}</td>
                    <td>{user["customizable"]}</td>

                    <td></td>
                  </tr>
                  <>
                    {expandedRows.includes(user.id) ? (
                      // <tr>
                      <td colspan="6">
                        <div
                          style={{
                            background: "#92eb34",
                            color: "#FFF",
                            padding: "10px",
                          }}
                        >
                          <thead style={{ background: "#92eb34" }}>
                            <tr>
                              <th>Story Name</th>
                              <th>Reporter</th>
                              <th>Asignee</th>
                              <th>Story Points</th>
                              <th>Customizable</th>
                            </tr>
                          </thead>
                          <tbody style={{ background: "#999999" }}>
                            {/* <tr key={user.id} style={{ cursor: "pointer" }}> */}
                            {user.storyData.map((story) => (
                              <>
                                <tr>
                                  <td>{story.story_name}</td>
                                  <td>{story.reporter}</td>
                                  <td>{story.asignee}</td>
                                  <td>{story.story_points}</td>
                                  <td>
                                    <input type="radio" />
                                  </td>
                                </tr>
                              </>
                            ))}
                            {/* </tr> */}
                          </tbody>
                        </div>
                      </td>
                    ) : null}
                  </>
                </>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
