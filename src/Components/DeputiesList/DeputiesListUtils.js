export const couleursGroupeParlementaire = {
  LREM: {
    couleur: "hsl(199, 100%, 58%)",
    nom_complet: "La République En Marche",
  },
  LR: {
    couleur: "hsl(223, 45%, 23%)",
    nom_complet: "Les Républicains",
  },
  MODEM: {
    couleur: "hsl(25, 81%, 54%)",
    nom_complet: "Mouvement Démocrate et apparentés",
  },
  SOC: {
    couleur: "hsl(354, 84%, 43%)",
    nom_complet: "Socialistes et apparentés",
  },
  UAI: {
    couleur: "hsl(194, 81%, 55%)",
    nom_complet: "UDI, Agir et Indépendants",
  },
  LFI: {
    couleur: "hsl(11, 66%, 47%)",
    nom_complet: "La France insoumise",
  },
  GDR: {
    couleur: "hsl(0, 100%, 43%)",
    nom_complet: "Gauche démocrate et républicaine",
  },
  LT: {
    couleur: "hsl(0, 0%, 50%)",
    nom_complet: "Libertés et Territoires",
  },
  NI: {
    couleur: "hsl(0, 0%, 80%)",
    nom_complet: "Non inscrits",
  },
  NG: {
    couleur: "hsl(0, 0%, 80%)",
    nom_complet: "Non inscrits",
  },
  UDI: {
    couleur: "hsl(261, 29%, 48%)",
    nom_complet: "Union des démocrates et indépendants",
  },
}

export const calculateNbDepute = (list, type, value) => {
  if (list.length > 0) {
    const filteredList = list
    switch (type) {
      case "groupe":
        return filteredList.filter(depute => {
          return depute.SigleGroupePolitique === value.groupe ? true : false
        }).length
      case "sexe":
        return filteredList.filter(depute => {
          return depute.Sexe === value ? true : false
        }).length
      default:
        return filteredList.length
    }
  } else {
    return list
  }
}

export const calculateAgeDomain = list => {
  const listAge = list.map(depute => depute.Age)
  return [Math.min(...listAge), Math.max(...listAge)]
}

export const groupesArrayToObject = (array, value = true) => {
  return array.reduce((a, b) => ((a[b] = value), a), {}) // eslint-disable-line
}

export const filterList = (list, state) => {
  return list
    .filter(depute => {
      return state.GroupeValue[depute.SigleGroupePolitique] ? true : false
    })
    .filter(depute => {
      return state.SexValue[depute.Sexe] ? true : false
    })
    .filter(depute => {
      return (
        depute.Age >= state.AgeDomain[0] && depute.Age <= state.AgeDomain[1]
      )
    })
}
