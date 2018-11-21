import React, { Component } from "react"
import ListDeputies from "./listDeputies/listDeputies"
import "./listDeputy.css"
import "../home/home.css"

class ListDeputy extends Component {
  render() {
    return (
      <section className="deputes__wrapper">
        <ListDeputies />
      </section>
    )
  }
}

export default ListDeputy
