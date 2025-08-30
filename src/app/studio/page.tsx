'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

export default function StudioPage() {
  return (
    <div suppressHydrationWarning>
      <NextStudio 
        config={config}
        unstable_noAuthBoundary
      />
    </div>
  )
}
