import React, { useEffect, useRef } from "react"

/**
 * Custom useEffect qui n'est pas appelé au render initial
 * @param effect Callback de useEffect habituel
 * @param deps Obligatoire sinon il ne sera jamais appelé
 */
export default function useNonInitialEffect(effect: React.EffectCallback, deps: React.DependencyList) {
  const initialRender = useRef(true)

  useEffect(() => {
    let effectReturns: void | (() => void | undefined) = () => {}

    if (initialRender.current) {
      initialRender.current = false
    } else {
      effectReturns = effect()
    }

    if (effectReturns && typeof effectReturns === "function") {
      return effectReturns
    }
  }, deps)
}
