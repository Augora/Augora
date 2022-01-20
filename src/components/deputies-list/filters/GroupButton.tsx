import React from "react"
import ButtonInput from "components/buttons/ButtonInput"
import { getGroupLogo } from "components/deputies-list/deputies-list-utils"

interface IGroupButton {
  group: Group.Group
  onClick(arg: string): void
  checked?: boolean
  children?: React.ReactNode
}

export default function GroupButton(props: IGroupButton) {
  const { checked = true, group, onClick, children, ...restProps } = props
  const GroupeLogo = getGroupLogo(group.Sigle)

  return (
    <ButtonInput
      key={`groupe--${group.Sigle}`}
      className={`groupe--${group.Sigle.toLowerCase()}`}
      category="groupe"
      style={{
        order: group.Ordre,
        borderColor: group.Couleur,
        backgroundColor: group.Couleur,
      }}
      color={group.Couleur}
      onClick={() => onClick(group.Sigle)}
      type="checkbox"
      checked={checked}
      {...restProps}
    >
      <div className="groupe__img-container">
        <div className="icon-wrapper">
          <GroupeLogo style={{ fill: group.Couleur }} />
        </div>
      </div>
      {children}
    </ButtonInput>
  )
}
