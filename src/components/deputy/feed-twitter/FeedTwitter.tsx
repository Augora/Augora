import React from "react"
import Block from "../_block/_Block"

/**
 * Return deputy's presence and participation graph in a Block component
 * @param {*} props
 */

const Feed = (props: Bloc.Base) => {
  return (
    <Block title="Feed Twitter" type="feed" color={props.color} size={props.size} wip={props.wip ? props.wip : false}>
      <a
        className="twitter-timeline"
        data-height="400"
        data-chrome="noheader nofooter transparent noscrollbar"
        href={`https://twitter.com/${props.twitter}?ref_src=twsrc%5Etfw`}
        lang="fr"
      />
      <script async src="//platform.twitter.com/widgets.js" charSet="utf-8" />
    </Block>
  )
}

export default Feed
