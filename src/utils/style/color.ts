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