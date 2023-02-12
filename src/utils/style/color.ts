export function getColorLuminosity(string: string) {
  return string.includes("hsl") ? parseInt(string.split(",")[2].split("%")[0]) : null
}

export function getTextColorContrast(type: string) {
  switch (type) {
    case "light":
      return "rgba(255,255,255,0.8)"
    case "dark":
      return "rgba(0,0,0,0.8)"
    default:
      return "rgba(0,0,0,0.8)"
  }
}

export function getHSLAsArray(string: string) {
  const hslRegex = /hsl\(([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\)/
  const colorArray = string.match(hslRegex).map((color, index) => {
    if (index > 0) {
      return parseFloat(color)
    }
  })
  return colorArray
}

export function getHSLLightVariation(color: Color.HSL, force: number = 5) {
  let gradientL = 0
  if (force >= 0) {
    gradientL = Math.max(color.L - force, 0)
  } else {
    gradientL = Math.min(color.L - force, 100)
  }

  return gradientL
}

/** Return a CSS color string when given a color object */
export const getCSSColor = (color: Color.Any) => {
  if (!color) return null
  else if (typeof color === "string") return color
  else if ("H" in color) {
    if ("A" in color) return `hsla(${color.H}, ${color.S}%, ${color.L}%, ${color.A})`
    else return `hsl(${color.H}, ${color.S}%, ${color.L}%)`
  } else if ("R" in color) {
    if ("A" in color) return `rgba(${color.R}, ${color.G}, ${color.B}, ${color.A})`
    else return `rgb(${color.R}, ${color.G}, ${color.B})`
  } else return null
}
