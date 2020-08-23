import React from "react"

// {
//   title: "lrem",
//   nbDeputes: 15,
//   totalDeputes: 300,
//   color: "blue",
//   age: 42,
//   hideNbDeputes: false,
// }

export function Tooltip(props) {
  return (
    <div className="tooltip">
      {props.age ? (
        <div className="tooltip__age">
          <span>{props.age}</span>
          Ans
        </div>
      ) : null}
      {props.title ? (
        <div
          className="tooltip__groupe"
          style={{
            color: `${props.color ? props.color : "#4d4d4d"}`,
          }}
        >
          {props.title}
        </div>
      ) : null}
      {props.nbDeputes != undefined && props.totalDeputes ? (
        <div
          className={`tooltip__numbers ${
            props.hideNbDeputes ? "tooltip__numbers--centered" : ""
          }`}
        >
          {!props.hideNbDeputes ? (
            <div className="tooltip__value">
              <span>{props.nbDeputes}</span>
              Députés
            </div>
          ) : null}
          <div className="tooltip__percentage">
            {Math.round(((props.nbDeputes * 100) / props.totalDeputes) * 100) /
              100}
            %
          </div>
        </div>
      ) : null}
    </div>
  )
}
