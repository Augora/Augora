import React, { useEffect, useCallback, useState } from "react"
import Slider from '@mui/material/Slider';
import debounce from "lodash/debounce"

function valuetext(value: number) {
  return `${value}°C`;
}

export default function AgeSlider(props) {
  console.log(props.selectedDomain)
  const [value, setValue] = useState<number[]>(props.selectedDomain);
  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  useEffect(() => {
    changeDomain(value)
  }, [value]);
  
  useEffect(() => {
    setValue(props.selectedDomain)
  }, [props.selectedDomain]);

  const changeDomain = useCallback(
    debounce((value) => {
      props.callback(value)
    }, 100),
    []
  )
  return (
    <div className="filters__age-slider">
      <Slider
        getAriaLabel={() => 'Âge'}
        value={value}
        min={props.domain[0]}
        max={props.domain[1]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
      />
      {props.children}
    </div>
  )
}
