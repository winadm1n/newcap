import React, { useEffect, useState } from 'react';
import ReactSwitch from 'react-switch';

function ToggleSwitch({capValue,epicStoryName}) {

    
  const [checked, setChecked] = useState(null);


  const handleChange = val => {
    console.log("value for ",epicStoryName,"is being changed from",checked,"to",!checked)
    if(checked){
        setCapitalizables(epicStoryName,0)
        capValue="Non-Capitalized"
        console.log("Should now change capitalizable to 0")
    } else {
        setCapitalizables(epicStoryName,1)
        capValue="Capitalized"
        console.log("Should now change capitalizable to 1")
    }
    console.log("mysterious value",val)
    setChecked(val)
  }

  const InitialValue = ()=>{
    console.log(capValue," is the initial value for",epicStoryName)
    if(capValue==="Capitalized") 
    setChecked(true)
    else
    setChecked(false)
  }

  const setCapitalizables = async (EpicStoryName,value) => {
    console.log("setting cap",value," for epic",EpicStoryName)
    const requestOptions = { method: 'GET' }
    await fetch(`http://localhost:5003/capitalize?EpicStoryName=${EpicStoryName}&value=${value}`, requestOptions)
      .catch((error) => console.log('error', error))

  };

  const something = async (epicStoryName) => {
    console.log("atleast soemthoing workds")
    const requestOptions = { method: 'GET' }
    await fetch(`http://localhost:5003/capitalized?EpicStoryName=${epicStoryName}`, requestOptions)
        .then((resp) => resp.json())
        .then((epicReponse) => {
          let capsvalue = epicReponse.fields.customfield_12185.value
          if(capValue==="Capitalized") 
            setChecked(true)
            else
            setChecked(false)
          
        })
        .catch((error) => console.log('error', error))
  }
  useEffect(() => {
    InitialValue();
  }, []);

  return (
    <div >
      <ReactSwitch
        checked={checked}
        onChange={handleChange}
        
      />
      </div>
  );
}

export default ToggleSwitch;