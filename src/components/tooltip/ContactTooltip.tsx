import React from "react"
import Tooltip from "components/tooltip/Tooltip"

interface IContactTooltip extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  links: string[]
}

/**
 * Renvoie une tooltip avec des liens clickables
 * @param {string[]} links Array des liens
 */
export default function ContactTooltip({ links, ...props }: IContactTooltip) {
  return (
    <Tooltip>
      {links.map((link) => (
        <a key={link} href={link.match(/^.*@.*\..*$/) ? `mailto:${link}` : link} {...props}>
          {link.replace(/(^\w+:|^)\/\//, "")}
        </a>
      ))}
    </Tooltip>
  );
}
