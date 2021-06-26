import React from "react"
import Block from "../_block/_Block"
import { TwitterTimelineEmbed } from "react-twitter-embed"

/**
 * Return deputy's presence and participation graph in a Block component
 * @param {*} props
 */
const Feed = (props: Bloc.Base) => {
  return (
    <Block title="Feed Twitter" type="feed" color={props.color} size={props.size} wip={props.wip ? props.wip : false}>
      <TwitterTimelineEmbed sourceType="profile" screenName={props.twitter} options={{ height: 400 }} />
    </Block>
  )
}

export default Feed
