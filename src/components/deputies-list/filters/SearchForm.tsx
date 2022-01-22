import React, { useCallback, useEffect, useRef, useState } from "react"
import IconClose from "images/ui-kit/icon-close.svg"
import IconSearch from "images/ui-kit/icon-loupe.svg"

interface ISearchForm {
  keyword?: string
  search?: {
    (arg: string): void
    flush(): void
  }
}

/**
 * Renvoie champ de recherche des filtres
 * @param {string} [keyword] Optionnel, pour passer un texte recherché
 * @param {(arg: string) => void} [search] Optionnel, callback de recherche sous la forme d'une debounce function
 */
export default function SearchForm({ keyword, search }: ISearchForm) {
  const [isSearchInteracted, setIsSearchInteracted] = useState(false)
  const [value, setValue] = useState("")

  const searchField = useRef<HTMLInputElement>()

  useEffect(() => {
    setValue(keyword)
  }, [keyword])

  /**
   * Pour update les différents states de la recherche
   * @param {string} [value] Reset le state si la valeur manque
   */
  const handleTextInput = search
    ? useCallback((value?: string) => {
        if (value && value.length > 0) {
          search(value)
          setValue(value)
        } else {
          search("")
          search.flush()
          setValue("")
        }
      }, [])
    : setValue

  return (
    <form
      className={`filters__search ${isSearchInteracted ? "filters__search--focus" : ""}`}
      onSubmit={(e) => {
        e.preventDefault()
        searchField.current.blur()
      }}
    >
      <div className="search__icon icon-wrapper">
        <IconSearch />
      </div>
      <input
        className="search__input"
        ref={searchField}
        type="text"
        placeholder="Chercher..."
        value={value}
        onChange={(e) => handleTextInput(e.target.value)}
        onFocus={() => setIsSearchInteracted(true)}
        onBlur={() => setIsSearchInteracted(false)}
      />
      <div className={`search__clear ${value.length > 0 ? "search__clear--visible" : ""}`}>
        <input className="search__clear-btn" type="reset" value="" title="Effacer" onClick={() => handleTextInput("")} />
        <div className="icon-wrapper">
          <IconClose />
        </div>
      </div>
    </form>
  )
}
