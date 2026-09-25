'use client'

import { createContext, useContext } from 'react'

export type StageMode = '3d' | 'static' | null

/** How the homepage engine is being shown: live 3D or a still figure, and on which layout. */
export const StageContext = createContext<{ mode: StageMode; desktop: boolean; active: boolean }>({
  mode: null,
  desktop: true,
  active: true,
})

export const useStage = () => useContext(StageContext)
