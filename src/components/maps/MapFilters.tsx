import React, { useState, useEffect } from "react"
import mapStore from "stores/mapStore"
import GroupBar from "components/deputies-list/GroupBar"
import Tooltip from "components/tooltip/Tooltip"
import Filters from "components//deputies-list/filters/Filters"
import Button from "components/buttons/Button"
import IconChevron from "images/ui-kit/icon-chevron.svg"
import useDeputiesFilters from "hooks/deputies-filters/useDeputiesFilters"
import { AnimatePresence, motion } from "framer-motion"

interface IMapFilters {
  zoneDeputies: Deputy.DeputiesList
}

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

  return (
    <div className="map__filters">
      <AnimatePresence mode="wait">
        <motion.div
          key={isBigFilter ? "big" : "small"}
          className="filters__container"
          initial={{ y: "calc(100% + 40px)", opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.1, duration: 0.3, ease: "easeOut" } }}
          exit={{ y: "calc(100% + 40px)", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {!isBigFilter ? (
            <>
              <div className="filters__close filters__close--mini">
                <Button className="close__btn" onClick={() => setIsBigFilter(true)} title="Agrandir les filtres">
                  <div className="icon-wrapper">
                    <IconChevron />
                  </div>
                </Button>
              </div>
              <Tooltip className="filters__mini" onClick={() => setIsBigFilter(true)}>
                <button className="mini__btn" title="Agrandir les filtres" onClick={() => setIsBigFilter(true)} />
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
            </>
          ) : (
            <>
              <div className="filters__close">
                <Button className="close__btn" onClick={() => setIsBigFilter(false)} title="Cacher les filtres">
                  <div className="icon-wrapper">
                    <IconChevron />
                  </div>
                </Button>
              </div>
              <div className="filters" style={viewsize.width < 875 ? { height: viewsize.height - 100 } : {}}>
                <Filters filteredDeputes={zoneDeputies} />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
