import React from "react"
import Coworker from "./coworker/Coworker"
import { slugify } from "utils/utils"
import Block from "../_block/_Block"
import IconGroupe from "images/ui-kit/icon-group.svg"
import FAQLink from "src/components/faq/Liens-faq"

/**
 * Return deputy's coworkers in a Block component
 * @param props
 */
function Coworkers(props: Bloc.Coworkers) {
  const nombreAssistants = props.coworkers.length
  const homme = props.coworkers.map((c) => /^M.\s/.test(c.coworker))
  return (
    <Block
      title={"Assistant" + (nombreAssistants == 0 ? "" : (homme.includes(true) ? "" : "e") + (nombreAssistants > 1 ? "s" : ""))}
      type="coworkers"
      color={props.color}
      size={props.size}
      wip={props.wip ? props.wip : false}
      info={
        <p>
          Un{" "}
          {
            <FAQLink link={"quest-ce-quun-assistant-parlementaire"} colorHSL={props.color.HSL.Full}>
              assistant parlementaire
            </FAQLink>
          }{" "}
          aide le député au quotidien. Leur contribution est assez variée. Cela va de la gestion des dossiers administratifs, à
          l'aide à la rédaction de propositions de lois ou d'amendements.
          <br />
          <br />
          Leur rôle est essentiel pour que le député puisse mener à bien son mandat.
        </p>
      }
      isLockedByDefault={false}
    >
      <div className="icon-wrapper">
        <IconGroupe />
      </div>
      <div className="deputy__coworkers">
        {props.coworkers.map((coworker) => {
          return (
            <Coworker
              key={slugify(coworker.coworker)}
              color={props.color.HSL.Full}
              {...coworker}
              isCompact={props.coworkers.length < 7 ? false : true}
            />
          )
        })}
      </div>
    </Block>
  )
}

export default Coworkers
