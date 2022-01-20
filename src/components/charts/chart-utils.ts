/**
 * Renvoie l'array des ages pour les chart age
 * @param groupList Liste des groups, en général `state.GroupesList`
 * @param list Liste de députés
 * @param ages L'age domain, en général `state.AgeDomain`
 * @param gender Pour filtrer selon le sexe, "H" ou "F", si omis, ne filtre pas
 */
export const getAgeData = (
  groupList: Group.GroupsList,
  list: Deputy.DeputiesList,
  ages: Filter.AgeDomain,
  gender?: string
): Chart.AgeData[] => {
  return Array<null>(ages[1] - ages[0] + 1)
    .fill(null)
    .map((nothing, index) => {
      const age = ages[0] + index
      const ageDeputies = list.filter((depute) => {
        if (!gender) return depute.Age === age
        else return depute.Age === age && depute.Sexe === gender
      })
      const groups = groupList.reduce((acc, cur) => {
        return {
          ...acc,
          [cur.Sigle]: ageDeputies.filter((depute) => depute.GroupeParlementaire.Sigle === cur.Sigle),
        }
      }, {})
      return {
        age: age,
        groups: groups,
        total: ageDeputies.length,
      }
    })
}

/**
 * Merge 2 objects group des chart age
 * @param groups1
 * @param groups2
 */
export const mergeGroups = (groups1: Chart.AgeGroupData, groups2: Chart.AgeGroupData): Chart.AgeGroupData => {
  if (!groups1 && !groups2) return {}
  if (!groups1) return groups2
  if (!groups2) return groups1

  const sigles = Object.keys(groups1)
  return sigles.reduce((acc, cur, i, array) => {
    return {
      ...acc,
      [array[i]]: [...groups1[array[i]], ...groups2[array[i]]],
    }
  }, {})
}

/**
 * Transforme un array de data age (32, 33, 34...) en une version avec rangées (32-36, 36-42,...)
 * @param data
 * @param range
 */
export const rangifyAgeData = (data: Chart.AgeData[], range: number): Chart.AgeData[] => {
  const rangeNb = Math.floor(data.length / range) + (data.length % range > 0 ? 1 : 0)
  const dataArray = Array.from(Array(rangeNb).keys())
  const rangeArray = Array.from(Array(range).keys())
  let i = 0
  return dataArray.map((nothing) => {
    return rangeArray.reduce<Chart.AgeData>((acc, cur) => {
      if (!data[i]) return acc
      const maxAge = i + range > data.length ? data[data.length - 1].age : data[i + range - 1].age

      const output = {
        age: acc.age ? acc.age : `${data[i].age}-${maxAge}`,
        groups: mergeGroups(acc.groups, data[i].groups),
        total: data[i].total + (acc.total ? acc.total : 0),
      }

      i++

      return output
    }, {} as Chart.AgeData)
  })
}
