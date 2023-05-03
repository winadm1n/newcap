import React, { useEffect, useState } from 'react';
import ReactSwitch from 'react-switch';

function ToggleSwitch({capValue,epicStoryName}) {
  const [checked, setChecked] = useState(true);

  const handleChange = val => {
    console.log("value for ",epicStoryName,"is being changed from",checked,"to",!checked)
    if(checked){
        setCapitalizables(epicStoryName,0)
    } else {
        setCapitalizables(epicStoryName,1)
    }
    console.log("mysterious value",val)
    setChecked(val)
    
    // if(checked)
    // setChecked(false)
    // else
    // setChecked(true)

  }

  const setInitialValue = ()=>{
    // console.log(capValue," at button found for",epicStoryName)
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

  useEffect(() => {
    // console.log("got cap ",capValue,"for epic button", epicStoryName);
    setInitialValue();
  });

  return (
      <ReactSwitch
        checked={checked}
        onChange={handleChange}
      />
  );
}

export default ToggleSwitch;