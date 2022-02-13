import React from "react"
import { Text } from "@visx/text"
import { scaleLog } from "@visx/scale"
import { Wordcloud } from "@visx/wordcloud"

const colors = ["#00bbcc", "#14ccae"]

function wordFreq(text: string): Chart.WordData[] {
  const words: string[] = text.replace(/\./g, "").split(/\s/)
  const freqMap: Record<string, number> = {}

  for (const w of words) {
    if (!freqMap[w]) freqMap[w] = 0
    freqMap[w] += 1
  }
  return Object.keys(freqMap).map((word) => ({ text: word, value: freqMap[word] }))
}

export default function WordCloud({ width, height, data }: Chart.WordCloud) {
  const words = wordFreq(data)
  const fontScale = scaleLog({
    domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
    range: [20, 100],
  })
  const fontSizeSetter = (datum: Chart.WordData) => fontScale(datum.value)

  return (
    <div className="wordcloud chart">
      <Wordcloud
        words={words}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={"Impact"}
        padding={2}
        spiral={"archimedean"}
        rotate={0}
        random={() => 0.5}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={"middle"}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
    </div>
  )
}
