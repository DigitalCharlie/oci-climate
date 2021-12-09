import './styles.scss'
import useWindowSize from '../hooks/useWindowSize'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import TopUsageGraph from './TopUsageGraph'
import YearlyUsageGraph from './YearlyUsageGraph'
import ReactTooltip from 'react-tooltip';
import MiniMap from './MiniMap'
import Switch from './Switch'
import Checkbox from './Checkbox'
import InfoIcon from './InfoIcon'
import YearPicker from './YearPicker'
const energyTypes = ['Fossil Fuel', 'Clean', 'Other']
export const colors = {
  'Fossil Fuel': '#EFC1A8',
  'Clean': '#99DEE3',
  'Other': '#6ABEF0',
}
export default function DataView(props) {
  const { data, headerHeight } = props
  console.log(data)
  const [selectedEnergyTypes , setSelectedEnergyTypes] = useState(['Fossil Fuel'])
  const [aggregationType, setAggregationType] = useState('sum')
  const [yearType, setYearType] = useState('all')
  const [customYears, setCustomYears] = useState([2013, 2020])
  const sections = [
    {
      title: 'Public Finance by Year',
      column: 'left',
      description: "International public finance by year and energy type, from G20 trade and development finance institutions. Filter to select a specific country or multilateral development bank, and to change what energy types are shown. Annual financing totals and data availability are often variable at individual institutions, so please use filtered results with caution — and read our About page for more information on the data.",
      content: (
        data.length ? <YearlyUsageGraph data={data} /> : null
      )

    },
    {
      title: 'Top 15 G20 Country Comparison',
      column: 'right',
      description: 'The top 15 G20 countries for international public finance for energy based on dashboard selections. This includes each country’s bilateral export credit agencies and development finance institutions, but not G20 country contributions to multilateral development banks which are not possible to disaggregate. Hover over each country label to see the institutions included.',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind !== 'Multilateral')} />
      )
    },
    {
      title: 'MDB Comparison',
      column: 'right',
      description: 'Public energy finance from the major multilateral development banks. G20 countries have the majority voting power at each of these institutions, but other countries have voting power and shares as well. Hover over each bank label to see the institutions included.',
      content: (
        <TopUsageGraph isBank data={data.filter(d => d.institutionKind === 'Multilateral')} />
      )
    },

    {
      title: 'ECAs Comparison',
      column: 'left',
      description: 'Public energy finance from G20 export credit agencies, by country. Export credit agencies are focused on trade finance and typically have a mandate to promote the export of goods and services from their country. Hover over each country label to see the institutions included.',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind === 'Export Credit')} />
      )
    },

    {
      title: 'DFIs Comparison',
      description: 'Public energy finance from G20 development finance institutions, by country. Hover over each country label to see the institutions included.',
      column: 'right',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind === 'Bilateral')} />
      )
    },
    {
      title: 'Public Finance by Recipient Country',
      column: 'left',
      description: 'Where G20 and MDB public finance for energy is flowing, by country.',
      content: (
        data.length ? <MiniMap data={data} /> : null
      )
    },
  ]
  sections.forEach((s, i) => s.index = i)

  const {width} = useWindowSize()

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  console.log(width)
  if (!width) {
    return null
  }
  const singleColumnView = width < 768
  console.log(singleColumnView)

  const sectionWidth = singleColumnView ? width - 20 - 16 * 2 : (width - 16 * 4 - 20) / 2
  const renderSection = (section) => {
    const description = section.description
    let defaultContent = <svg width={sectionWidth} height={200 + section.index * 50} />
    let content = section.content ?
      React.cloneElement(section.content,
        {
          width: sectionWidth,
          height: 200,
          selectedEnergyTypes,
          aggregationType,
          yearType,
          customYears,
        }) :
      defaultContent
    return (
      <section key={section.title}>
        <h2>{section.title}
        </h2>
        <div className='description'>{description}</div>
        {content}
      </section>
    )
  }
  let sectionDivs = sections.map(renderSection)

  if (!singleColumnView) {
    const leftSections = sections.filter(section => section.column === 'left')
    const rightSections = sections.filter(section => section.column === 'right')
    sectionDivs = <React.Fragment>
      <div className="left-sections column">
        {leftSections.map(renderSection)}
      </div>
      <div className="right-sections column">
        {rightSections.map(renderSection)}
      </div>
    </React.Fragment>
  }


  return (
    <div style={{ marginTop: headerHeight }}>
      <div className='controls'>


        <Switch
          label=''
          label1='Total Sum'
          label2='Average Annual'
          value={aggregationType === 'sum'}
          toggle={() => setAggregationType(aggregationType === 'sum' ? 'average' : 'sum')}
        />
        <YearPicker
          value={yearType}
          onChange={e => setYearType(e.target.value)}
          customYears={customYears}
          setCustomYears={setCustomYears}
        />
        <div>
          {energyTypes.map(type => {
            const color = colors[type]
            const enabled = selectedEnergyTypes.includes(type)
            const isOther = type === 'Other'
            const dataTip = isOther ? `<div><div style="font-weight: bold">Other energy type:</div>This includes large hydropower, nuclear, and biomass projects as well as energy spending that cannot be specifically linked to a source of energy (most frequently this is for electricity transmission and distribution projects).</div>` : null
            return (
              <label className='energyTypeToggle' key={type} style={{ backgroundColor: color,  opacity: enabled ? null : 0.35 }} onClick={ () => {

                  const newSelected = selectedEnergyTypes.includes(type) ?
                    selectedEnergyTypes.filter(t => t !== type) :
                    [...selectedEnergyTypes, type]
                  if (newSelected.length === 0) {
                    return selectedEnergyTypes
                  }
                  newSelected.sort((a, b) => {
                    const aIndex = energyTypes.indexOf(a)
                    const bIndex = energyTypes.indexOf(b)
                    return aIndex - bIndex
                  })

                  setSelectedEnergyTypes(newSelected)
              }}>
                <Checkbox
                  checked={enabled}
                />
                {type}
                {isOther ?
                  <InfoIcon dataHtml={true} dataTip={dataTip} style={{ marginLeft: '1em', transform: 'translateY(1px)'}} /> : null
                }
              </label>

            )
          })}
        </div>
      </div>
      <div className={classNames('DataView', { twoColumnView: !singleColumnView })}>
        {sectionDivs}
      </div>
    </div>
  )
}
