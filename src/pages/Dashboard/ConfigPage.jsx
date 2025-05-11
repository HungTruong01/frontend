import React from 'react'
import Config from './system/Config'
import FeatureConfig from './system/FeatureConfig'
import ServiceConfig from './system/ServiceConfig'

const ConfigPage = () => {
  return (
    <>
        <Config />
        <ServiceConfig />
        <FeatureConfig />
    </>
  )
}

export default ConfigPage