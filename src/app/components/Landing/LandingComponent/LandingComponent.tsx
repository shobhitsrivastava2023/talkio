import React from 'react'
import { LandingHeader } from '../LandingHeader/LandingHeader'
import LandingImages from '../LandingImages/LandingImages'

const LandingComponent = () => {
  return (
    <div >
      <LandingHeader LandingTitle="Talkio" LandingSubTitle="Chat clean" />
      <LandingImages />
    </div>
  )
}

export default LandingComponent