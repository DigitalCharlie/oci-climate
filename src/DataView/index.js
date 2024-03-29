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
import { finalYear } from 'App'
const ExLink = ({href, children}) => {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}
const energyTypes = ['Fossil Fuel', 'Clean', 'Other']
export const colors = {
  // OLD COLORS
  // 'Fossil Fuel': '#EFC1A8',
  // 'Clean': '#99DEE3',
  // 'Other': '#6ABEF0',
  // NEW COLORS
  'Fossil Fuel': '#04000A',
  'Clean': '#A4BA45',
  'Other': '#8492DC',
}
export default function DataView(props) {
  const downloadPath = `OCI Public Finance for Energy Database - Download Copy.xlsx`
  const { data, headerHeight } = props
  console.log(data)
  const [selectedEnergyTypes , setSelectedEnergyTypes] = useState(['Fossil Fuel'])
  const [aggregationType, setAggregationType] = useState('average')
  const [yearType, setYearType] = useState('custom')
  const [customYears, setCustomYears] = useState([2017, finalYear])
  const sections = [
    {
      title: 'Public Finance by Year',
      orderMultiColumnView: 0,
      description: <React.Fragment>International public finance by year and energy type, from multilateral development banks (MDBs), G20 export credit agencies (ECAs), and G20 development finance institutions (DFIs). Filter to select a specific country or MDB. Annual financing totals and data availability are often variable at individual institutions, so please use filtered results with caution — and read our <Link to='/about'>About page</Link> for more information on our data and methodology.</React.Fragment>,
      content: (
        data.length ? <YearlyUsageGraph data={data} /> : null
      )

    },
    {
      title: 'Top 15 G20 Country Comparison',
      orderMultiColumnView: 1,
      description: 'The 15 countries with the largest flows of international public finance for energy based on your dashboard selections. This includes finance from bilateral export credit agencies and development finance institutions, but not G20 country contributions to multilateral development banks as these are not possible to disaggregate. Hover over each country label to see the institutions included.',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind !== 'Multilateral')} />
      )
    },
    {
      title: 'Multilateral Development Banks Comparison',

      orderMultiColumnView: 3,
      description: 'Public energy finance from the major multilateral development banks. Note that G20 countries are collectively major shareholders of each of these institutions, but that many other countries hold shares as well. Hover over each bank label to see the institutions included.',
      content: (
        <TopUsageGraph isBank data={data.filter(d => d.institutionKind === 'Multilateral')} />
      )
    },

    {
      title: 'Export Credit Agencies Comparison',

      orderMultiColumnView: 5,
      description: 'Public energy finance from G20 export credit agencies, by country. Export credit agencies are focused on trade finance and typically have a mandate to promote the export of goods and services from their country. Hover over each country label to see the institutions included.',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind === 'Export Credit')} />
      )
    },

    {
      title: 'Development Finance Institutions Comparison',
      orderMultiColumnView: 2,
      description: 'Public energy finance from G20 development finance institutions, by country. Hover over each country label to see the institutions included.',
      column: 'right',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind === 'Bilateral')} />
      )
    },
    {
      title: 'Public Finance by Country',
      column: 'left',
      orderMultiColumnView: 4,
      description: `Where G20 and MDB public finance for energy is flowing, by country. Grouped either by recipient or financing country (use toggle below). Click on 'Clean' or 'Other' to see non-fossil fuel finance flows. Hover over each country to see flow amounts.`,
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
  const singleColumnView = width < 1100
  console.log(singleColumnView)

  // This section width determines size of the svg on the data dashboard
  const sectionWidth = singleColumnView ? width - 20 - 16 * 2 : (width - 90 * 4 - 100) / 2
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
        <h1>Data Dashboard</h1>
        <div className='description'>
<p>Public finance institutions play an outsized role in shaping our future energy system by providing government-backed, low-risk finance that is often a determining factor in which projects get built. This dashboard shows the total flows of public finance going to fossil fuel, clean, and other energy projects from G20 countries’ trade and development finance institutions as well as the major multilateral development banks.
</p>

<p><strong>How to use this dashboard:</strong> Use the controls below to add or remove data on fossil, clean, and other energy, change the years displayed, or show totals rather than annual averages. You can hover over a country or institution on a graph to see more details, and toggle some graph-specific settings. For details on our methodology, see the <Link to="/about">About</Link> page. Our full dataset includes information on each transaction behind this data as well as details about the kind of finance, energy sub-type, and supply chain stage. Click <a  href={`${process.env.PUBLIC_URL}/${downloadPath}`}>here</a> to download the dataset as a spreadsheet (.xlsx file) and click <ExLink href="https://act.priceofoil.org/signup/public-finance-energy-database-updates/">here</ExLink> to sign up to get email updates when a new dataset is available.</p>

<p>* By a country indicates very limited or no direct reporting is available from this country or institution. However, note that all institutions have gaps in reporting, especially for indirect support through financial intermediation, policy-based lending at the MDBs, technical assistance, and associated facilities.  
</p>
        </div>
      </div>
      <div className='controls'>

        <YearPicker
          value={yearType}
          onChange={e => setYearType(e.target.value)}
          customYears={customYears}
          setCustomYears={setCustomYears}
        />
        <Switch
          label=''
          label1='Total Sum'
          label2='Average Annual'
          value={aggregationType === 'sum'}
          toggle={() => setAggregationType(aggregationType === 'sum' ? 'average' : 'sum')}
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
