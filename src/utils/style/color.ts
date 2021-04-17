export function getColorLuminosity(string: string) {
  return string.includes("hsl")
    ? parseInt(string.split(",")[2].split("%")[0])
    : null
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
      return parseFloat(color);
    }
  })
  return colorArray;
}

export function getHSLLightVariation(color: Group.HSLDetail, force: number = 5) {
  let gradientL = 0
  if (force >= 0) {
    gradientL = Math.max(color.L - force, 0)
  } else {
    gradientL = Math.min(color.L - force, 100)
  }

  return gradientL
}