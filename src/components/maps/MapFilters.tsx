import React, { useState, useEffect } from "react"
import mapStore from "stores/mapStore"
import CustomControl from "components/maps/CustomControl"
import GroupBar from "components/deputies-list/GroupBar"
import Tooltip from "components/tooltip/Tooltip"
import Filters from "components//deputies-list/filters/Filters"
import Button from "components/buttons/Button"
import IconChevron from "images/ui-kit/icon-chevron.svg"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { gsap } from "gsap"

interface IMapFilters {
  zoneDeputies: Deputy.DeputiesList
}

const timer = 0.2

/**
 * Renvoie le mini filtre et filtre qui s'intervertissent au clic
 * @param {Deputy.DeputiesList} zoneDeputies La liste de députés dans la zone visible actuellement
 */
export default function MapFilters({ zoneDeputies }: IMapFilters) {
  const [isBigFilter, setIsBigFilter] = useState(false)
  // const filterRef = useRef(null);

  const viewsize = mapStore((state) => state.viewsize)

  const {
    state: { DeputiesList },
  } = useDeputiesFilters()

  const animateFilters = (filterState) => {
    const tl = gsap.timeline()
    tl.fromTo(
      ".map__filters",
      {
        y: "0%",
        autoAlpha: 1,
      },
      {
        y: "100%",
        autoAlpha: 0,
        ease: "power1.out",
        duration: timer,
      }
    )
    tl.call(() => setIsBigFilter(filterState))
    tl.play()
  }

  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(
      ".map__filters",
      {
        y: "100%",
        autoAlpha: 0,
      },
      {
        y: "0%",
        autoAlpha: 1,
        ease: "power1.out",
        delay: timer + 0.1,
        duration: timer,
      }
    )

    return () => {
      tl.kill()
    }
  }, [isBigFilter])

  return (
    <CustomControl className="map__filters">
      {!isBigFilter ? (
        <div className="filters__container">
          <div className="filters__close filters__close--mini">
            <Button className="close__btn" onClick={() => animateFilters(true)} title="Agrandir les filtres">
              <div className="icon-wrapper">
                <IconChevron />
              </div>
            </Button>
          </div>
          <Tooltip className="filters__mini" onClick={() => animateFilters(true)}>
            <button className="mini__btn" title="Agrandir les filtres" onClick={() => animateFilters(true)} />
            <div className="mini__number">
              <span>
                {zoneDeputies.length}
                <small>Députés</small>
              </span>
              <span>
                <small>Total</small>
                {DeputiesList.length}
              </span>
            </div>
            <GroupBar className="mini__bar" deputiesList={zoneDeputies} />
          </Tooltip>
        </div>
      ) : (
        <div className="filters__container">
          <div className="filters__close">
            <Button className="close__btn" onClick={() => animateFilters(false)} title="Cacher les filtres">
              <div className="icon-wrapper">
                <IconChevron />
              </div>
            </Button>
          </div>
          <div className="filters" style={viewsize.width < 875 ? { height: viewsize.height - 100 } : {}}>
            <Filters filteredDeputes={zoneDeputies} />
          </div>
        </div>
      )}
    </CustomControl>
  )
}
