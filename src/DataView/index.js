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
import { Link } from 'react-router-dom'
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
  const [aggregationType, setAggregationType] = useState('average')
  const [yearType, setYearType] = useState('custom')
  const [customYears, setCustomYears] = useState([2018, 2020])
  const sections = [
    {
      title: 'Public Finance by Year',
      orderMultiColumnView: 0,
      description: <React.Fragment>International public finance by year and energy type, from G20 trade and development finance institutions. Filter to select a specific country or multilateral development bank, and to change what energy types are shown. Annual financing totals and data availability are often variable at individual institutions, so please use filtered results with caution — and read our <Link to='/about'>About page</Link> for more information on the data.</React.Fragment>,
      content: (
        data.length ? <YearlyUsageGraph data={data} /> : null
      )

    },
    {
      title: 'Top 15 G20 Country Comparison',
      orderMultiColumnView: 1,
      description: 'The top 15 G20 countries for international public finance for energy based on dashboard selections. This includes each country’s bilateral export credit agencies and development finance institutions, but not G20 country contributions to multilateral development banks which are not possible to disaggregate. Hover over each country label to see the institutions included.',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind !== 'Multilateral')} />
      )
    },
    {
      title: 'MDB Comparison',

      orderMultiColumnView: 3,
      description: 'Public energy finance from the major multilateral development banks. G20 countries have the majority voting power at each of these institutions, but other countries have voting power and shares as well. Hover over each bank label to see the institutions included.',
      content: (
        <TopUsageGraph isBank data={data.filter(d => d.institutionKind === 'Multilateral')} />
      )
    },

    {
      title: 'ECAs Comparison',

      orderMultiColumnView: 5,
      description: 'Public energy finance from G20 export credit agencies, by country. Export credit agencies are focused on trade finance and typically have a mandate to promote the export of goods and services from their country. Hover over each country label to see the institutions included.',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind === 'Export Credit')} />
      )
    },

    {
      title: 'DFIs Comparison',
      orderMultiColumnView: 2,
      description: 'Public energy finance from G20 development finance institutions, by country. Hover over each country label to see the institutions included.',
      column: 'right',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind === 'Bilateral')} />
      )
    },
    {
      title: 'Public Finance by Recipient Countries',
      column: 'left',
      orderMultiColumnView: 4,
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
    const sorted = [...sections]
    sorted.sort((a, b) => a.orderMultiColumnView - b.orderMultiColumnView)
    sectionDivs = sorted.map(renderSection)
  }


  return (
    <div style={{ marginTop: headerHeight }}>
      <div className='dataViewIntro'>
        <h2>Data Dashboard</h2>
        <div className='description'>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel elit sit amet justo malesuada porta. Nunc risus erat, scelerisque sit amet luctus id, bibendum eget sapien. Nunc condimentum turpis ac leo aliquet, eget consectetur magna suscipit. Morbi rhoncus metus eget lacus dignissim, at tempus massa finibus. Aenean ac enim ultricies, condimentum diam et, suscipit tortor. Curabitur interdum porta odio, eu blandit eros egestas vel. Suspendisse feugiat odio elit, sed dictum arcu cursus vel. Etiam pharetra neque sit amet lectus eleifend posuere.

          </p>
          <p>
            Ut mollis accumsan dolor, eget auctor dui elementum quis. Duis velit diam, maximus in fringilla blandit, luctus a nibh. In nec fringilla urna. Aliquam quam lorem, condimentum at consequat sit amet, tincidunt accumsan neque. Duis sed consequat odio. Morbi at sodales sem. Praesent eget varius sem. Donec ipsum lorem, pharetra sit amet lorem ornare, tempus laoreet leo. Fusce elit augue, ornare ut efficitur a, fringilla ac turpis. Sed ut tellus ut eros ullamcorper rutrum. Nunc vel sollicitudin lorem.
          </p>
        </div>
      </div>
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
        <div className='energyTypes'>
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
      <div className='disclaimer'>
        * Limited or no direct reporting available. To read about how our data is sourced, see the <Link to='/about'>About page</Link>.
      </div>
    </div>
  )
}
