import React from "react"
import { BaseControl, BaseControlProps } from "react-map-gl"
import IconPin from "../../images/ui-kit/icon-pin.svg"

export interface ResetControlProps extends BaseControlProps {
  onReset: Function
  className?: string
  title?: string
}

export default class ResetControl extends BaseControl<
  ResetControlProps,
  HTMLButtonElement
> {
  public static defaultProps = {
    className: "",
    title: "Réinitialiser",
  }

  _render() {
    return (
      <button
        ref={this._containerRef}
        className={this.props.className}
        onClick={() => this.props.onReset()}
        title={this.props.title}
      >
        <div className="icon-wrapper">
          <IconPin />
        </div>
      </button>
    )
  }
}
