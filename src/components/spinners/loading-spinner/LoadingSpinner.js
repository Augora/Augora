import React, { Component } from "react"
import "./loading-spinner.css"

class LoadingSpinner extends Component {
  render() {
    return (
      <div className="loading-spinner">
        <div className="spinner">
          <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle
              className="length"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              cx="33"
              cy="33"
              r="28"
            />
          </svg>
          <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              cx="33"
              cy="33"
              r="28"
            />
          </svg>
          <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              cx="33"
              cy="33"
              r="28"
            />
          </svg>
          <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              cx="33"
              cy="33"
              r="28"
            />
          </svg>
        </div>
      </div>
    )
  }
}

export default LoadingSpinner
