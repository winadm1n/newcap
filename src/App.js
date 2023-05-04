import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import axios from "axios";
import ToggleSwitch from './Components/ToggleSwitch';

import { data } from "./Users";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const initialState = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];
  const [expandedRows, setExpandedRows] = useState([]);
  const [expandState, setExpandState] = useState({});
  const [project, setProject] = useState("");
  const [epics, setEpics] = useState(null);
  const [stories, setStories] = useState([]);
  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('1');
  const [caps, setCaps] = useState([])


  const radios = [
    { name: '', value: '1' },
    { name: '', value: '2' },
  ];
  

  const handleEpandRow = (event, userId, indexId) => {
    const currentExpandedRows = expandedRows;
    const isRowExpanded = currentExpandedRows.includes(userId);
    //setEpicIndex(userId);
    let obj = {};
    isRowExpanded ? (obj[userId] = false) : (obj[userId] = true);
    setExpandState(obj);
    // If the row is expanded, we are here to hide it. Hence remove
    // it from the state variable. Otherwise add to it.
    const newExpandedRows = isRowExpanded
      ? currentExpandedRows.filter((id) => id !== userId)
      : currentExpandedRows.concat(userId);

    setExpandedRows(newExpandedRows);
    getStories(indexId, userId);
  };

  const handleChange = (event) => {
    console.log(event.target.value)
    setProject(event.target.value);
    console.log("prject: ", project);
    getEpics();
  };

  const getEpics = async () => {
    const requestOptions = { method: 'GET' }
    await fetch(`http://localhost:5003/epics?project=${project}`, requestOptions)
      .then((resp) => resp.json())
      .then((epicReponse) => {
        let i = 0;
        setEpics(epicReponse.issues.reduce((acc, cur) => {
          return acc.concat([[i++, cur.fields.summary, cur.id, cur.key]]);
        }, []));
      })
      .catch((error) => console.log('error', error))
    console.log("epics :", epics)
    

  };

  const getCapitalizablesForAll = ()=>{
    console.log("Getting epic capitalizables ")

    epics?.map((epic) =>
    {
      getCapitalizables(epic[2],epic[3]);
    })
    
    console.log("Got epic capitalizables ")
  }

  //DoNotUse, only incase of changing all the epics
  // const setCapitalizablesForAll = ()=>{
  //   console.log("Setting epic capitalizables ")
  //   epics?.map((epic) =>
  //   {
  //     setCapitalizables(epic[2],epic[3],0);
  //   })
  // }


  const getCapitalizables = async (key,EpicStoryName) => {
    console.log("getting caps for", EpicStoryName)
    const requestOptions = { method: 'GET' }
    await fetch(`http://localhost:5003/capitalized?EpicStoryName=${EpicStoryName}`, requestOptions)
      .then((resp) => resp.json())
      .then((epicReponse) => {
        let capsObj = {}
        capsObj.key = key;
        capsObj.value = epicReponse.fields.customfield_12185.value
        setCaps((current) => [capsObj, ...current])
        // console.log("caps :", caps)
      })
      .catch((error) => console.log('error', error))
  };

  
  const getStories = async (epicIndex, key) => {
    const requestOptions = { method: 'GET' }
    console.log("the epic i ewant is:", epics[epicIndex][3])
    await fetch(`http://localhost:5003/stories?epic=${epics[epicIndex][3]}`, requestOptions)
      .then((resp) => resp.json())
      .then((epicReponse) => {
        let storyObj = {}
        storyObj.key = key;
        storyObj.epics = epicReponse.issues.reduce((acc, cur) => {
          return acc.concat([[cur.fields.summary, cur.fields.name, cur.fields.reporter, cur.fields.assignee, cur.fields.customfield_10006]]);
        }, []);
        console.log("My obj: ", key, JSON.stringify(storyObj.key), JSON.stringify(storyObj.value))
        console.log("before stories: ", stories)
        setStories((current) => [storyObj, ...current]);
        // setStories(stateObject)
        console.log("State Stories: ", stories)
        // storyObj[key]=stories;
        //Object.assign(storyObj, {  key: stories });

        // storyObj(stories.key: )
        //   setStories(epicReponse.issues.reduce((acc, cur) => {
        //     return acc.concat([[cur.fields.summary, cur.fields.name, cur.fields.reporter, cur.fields.assignee, cur.fields.customfield_10006, cur.id]]);
        // }, []));
        // console.log("my stories: ", stories);
      })
      .catch((error) => console.log('error', error))


  };

  useEffect(() => {
    getEpics();
    // getCapitalizablesForAll();
    // getCapitalizables(1,"BROA-5031");
    // setCapitalizables(1,"BROA-5031",0)
  }, [project]);

  useEffect(() => {
     getCapitalizablesForAll();
  }, [epics]);

  useEffect(() => {
    console.log(caps)
  }, [caps]);

  const getCapValueFor = (epic)=>{
    if(caps && caps.length !== 0 && caps.findIndex(o => o.key == epic[2]) !== -1)
      return caps[caps.findIndex(o => o.key == epic[2])].value
    return -1
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1> Users({data.length})</h1>
        </Col>
        <Col>
          <form onSubmit>
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={handleChange}
            //value={project}
            >
              <option value="">select a project</option>
              <option value="BROA">BrillioOne.ai</option>
              <option value="TST">Test</option>
              {/* <option value="">select a project</option>
                {
                  jiraProjects.map((proj) => (
                    <option key={proj.id} value={proj.name}>
                      {proj.name}
                    </option>
                  ))
                  
                } */}
            </select>
          </form>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Table responsive>
            <thead style={{ background: "#92eb34" }}>
              <tr>
                <th>Epic Name</th>
                <th>Epic ID</th>
                <th>Captalized</th>
              </tr>
            </thead>
            <tbody>
              {epics && epics.map((epic, Eid) => (
                <>
                  <tr
                    key={epic[2]}
                    style={{ cursor: "pointer" }}
                  >
                    <td onClick={(event) => handleEpandRow(event, epic[2], epic[0])}>{epic[1]}</td>
                    <td>{epic[3]}</td>
                    <td>
                      {/* if(caps && caps.length !== 0 && */}
                     {caps && caps.length==epics.length && <ToggleSwitch capValue={getCapValueFor(epic) } epicStoryName={epic[3]}/>}
                    {/* <ButtonGroup >
                      {radios.map((radio,idx) => (
                        <ToggleButton
                          key={`key-${idx}-${epic[2]}`}
                          id={`radio-${idx}-${Eid}`}
                          type="radio"
                          variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                          name="radio"
                          value={radio.value}
                          checked={radioValue === radio.value}
                          onChange={(e) => setRadioValue(e.currentTarget.value)}
                        >
                          {radio.name}
                        </ToggleButton>
                      ))}
                    </ButtonGroup> */}
                    </td>

                    <td></td>
                  </tr>
                  <>
                    {expandedRows.includes(epic[2]) ? (
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

                            {stories && stories.length !== 0 && stories.findIndex(o => o.key == epic[2]) !== -1 && stories[stories.findIndex(o => o.key == epic[2])].epics.map((story) => (
                              <>
                                <tr key={story[5]}>
                                  <td>{story[0]}</td>
                                  <td>{story[2].displayName}</td>
                                  <td>{story[3].displayName}</td>
                                  <td>{story[4]}</td>
                                  <td>
                                    <input type="radio" />
                                  </td>
                                </tr>
                              </>
                            ))}
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
