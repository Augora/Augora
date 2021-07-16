import React, { useEffect } from "react"
import Block from "../_block/_Block"

/**
 * Return deputy's presence and participation graph in a Block component
 * @param {*} props
 */

const checkTweets = (url) => {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = url
    script.async = true
    script.charset = "utf-8"

    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [url])
}

const Feed = (props: Bloc.Base) => {
  return (
    <Block
      title="Twitter"
      type="feed"
      color={props.color}
      size={props.size}
      twitter={props.twitter}
      wip={props.wip ? props.wip : false}
    >
      {checkTweets("https://platform.twitter.com/widgets.js")}
      <a
        className="twitter-timeline"
        data-height="400"
        data-chrome="noheader nofooter transparent noscrollbar"
        data-dnt="true"
        href={`https://twitter.com/${props.twitter}?ref_src=twsrc%5Etfw`}
        lang="fr"
      />
    </Block>
  )
}

export default Feed
