import { create } from "zustand"

interface AccropolisState {
  activeDepute: any,
  activeDeputeIndex: number,
  question: string,
  setActiveDepute(value: any): void
  setActiveDeputeIndex(value: any): void
  setquestion(value: any): void
}

const accropolisStore = create<AccropolisState>((set) => ({
  // Variables
  activeDepute: null,
  activeDeputeIndex: 0,
  question: '',

  setActiveDepute(value: any) {
    set(() => {
      return { activeDepute: value }
    })
  },

  setActiveDeputeIndex(value: number) {
    set(() => {
      return { activeDeputeIndex: value }
    })
  },

  setquestion(value: string) {
    set(() => {
      return { question: value }
    })
  },
}))

export default accropolisStore
