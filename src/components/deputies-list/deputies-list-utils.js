const udi = "/images/logos/groupes-parlementaires/udi/udi_blanc.png"
const gdr = "/images/logos/groupes-parlementaires/gdr/gdr_blanc.png"
const lfi = "/images/logos/groupes-parlementaires/lfi/lfi_blanc.png"
const lr = "/images/logos/groupes-parlementaires/lr/lr_blanc.png"
const lrem = "/images/logos/groupes-parlementaires/lrem/lrem_blanc.png"
const lt = "/images/logos/groupes-parlementaires/lt/lt_blanc.png"
const modem = "/images/logos/groupes-parlementaires/modem/modem_blanc.png"
const ni = "/images/logos/groupes-parlementaires/ni/ni_blanc.png"
const ps = "/images/logos/groupes-parlementaires/ps/ps_blanc.png"
const ae = "/images/logos/groupes-parlementaires/ae/ae_blanc.png"
const udicolor = "/images/logos/groupes-parlementaires/udi/udi_color.png"
const gdrcolor = "/images/logos/groupes-parlementaires/gdr/gdr_color.png"
const lficolor = "/images/logos/groupes-parlementaires/lfi/lfi_color.png"
const lrcolor = "/images/logos/groupes-parlementaires/lr/lr_color.png"
const lremcolor = "/images/logos/groupes-parlementaires/lrem/lrem_color.png"
const ltcolor = "/images/logos/groupes-parlementaires/lt/lt_color.png"
const modemcolor = "/images/logos/groupes-parlementaires/modem/modem_color.png"
const nicolor = "/images/logos/groupes-parlementaires/ni/ni_color.png"
const pscolor = "/images/logos/groupes-parlementaires/ps/ps_color.png"
const aecolor = "/images/logos/groupes-parlementaires/ae/ae_color.png"

export const calculateNbDepute = (list, type, value) => {
  if (list.length > 0) {
    const filteredList = list
    switch (type) {
      case "groupe":
        return filteredList.filter((depute) => {
          return depute.GroupeParlementaire.Sigle === value ? true : false
        }).length
      case "sexe":
        return filteredList.filter((depute) => {
          return depute.Sexe === value ? true : false
        }).length
      default:
        return filteredList.length
    }
  } else return 0
}

export const calculateAgeDomain = (list) => {
  const listAge = list.map((depute) => depute.Age)
  return [Math.min(...listAge), Math.max(...listAge)]
}

export const groupesArrayToObject = (array, value = true) => {
  return array.reduce((a, b) => ((a[b] = value), a), {}) // eslint-disable-line
}

export const filterList = (list, state) => {
  return list
    .filter((depute) => {
      return state.GroupeValue[depute.GroupeParlementaire.Sigle] ? true : false
    })
    .filter((depute) => {
      return state.SexValue[depute.Sexe] ? true : false
    })
    .filter((depute) => {
      return depute.Age >= state.AgeDomain[0] && depute.Age <= state.AgeDomain[1]
    })
}

export const groupeIconByGroupeSigle = (groupe, isDisabled) => {
  switch (groupe) {
    case "LFI":
      return isDisabled ? lficolor : lfi
    case "GDR":
      return isDisabled ? gdrcolor : gdr
    case "LT":
      return isDisabled ? ltcolor : lt
    case "MODEM":
      return isDisabled ? modemcolor : modem
    case "SOC":
      return isDisabled ? pscolor : ps
    case "LR":
      return isDisabled ? lrcolor : lr
    case "LREM":
      return isDisabled ? lremcolor : lrem
    case "UDI":
      return isDisabled ? udicolor : udi
    case "UAI":
      return isDisabled ? udicolor : udi
    case "AE":
      return isDisabled ? aecolor : ae
    default:
      return isDisabled ? nicolor : ni
  }
}
