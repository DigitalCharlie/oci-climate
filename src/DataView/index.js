import './styles.scss'
import useWindowSize from '../hooks/useWindowSize'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import TopUsageGraph from './TopUsageGraph'
import YearlyUsageGraph from './YearlyUsageGraph'
import infoIcon from '../images/info_icon.svg'
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
const loremIpsum = `Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum. Sed ut perspiciatis unde omnis istpoe natus error sit voluptatem accusantium doloremque eopsloi laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunot.`
export default function DataView(props) {
  const { data } = props
  console.log(data)
  const [selectedEnergyTypes , setSelectedEnergyTypes] = useState(['Fossil Fuel'])
  const [aggregationType, setAggregationType] = useState('sum')
  const [yearType, setYearType] = useState('all')
  const [customYears, setCustomYears] = useState([2013, 2020])
  const sections = [
    {
      title: 'Energy Investment',
      column: 'left',
      content: (
        data.length ? <YearlyUsageGraph data={data} /> : null
      )

    },
    {
      title: 'Top 15 G20 Country Comparison',
      column: 'right',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind !== 'Multilateral')} />
      )
    },
    {
      title: 'MDB Comparison',
      column: 'right',
      content: (
        <TopUsageGraph isBank data={data.filter(d => d.institutionKind === 'Multilateral')} />
      )
    },

    {
      title: 'ECAs Comparison',
      column: 'left',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind === 'Export Credit')} />
      )
    },

    {
      title: 'DFIs Comparison',
      column: 'right',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind === 'Bilateral')} />
      )
    },
    {
      title: 'Energy investment recipient country',
      column: 'left',
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
    const description = section.description || loremIpsum
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
          <img alt='lorem ipsum dollar...' src={infoIcon} data-tip='Lorem ipsum dollar...' />
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
    <div>
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
