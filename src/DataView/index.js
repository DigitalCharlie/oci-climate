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
import ScopePicker from './ScopePicker'
import YearPicker from './YearPicker'
import { Link } from 'react-router-dom'
import { finalYear } from 'App'
const ExLink = ({href, children}) => {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}
const energyTypes = ['Fossil Fuel', 'Clean', 'Other']
const fossilFuelSubTypes = ['Coal', 'Oil', 'Gas', 'Oil and Gas', 'CCS', 'Hydrogen']
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
  const [selectedEnergyTypes , setSelectedEnergyTypes] = useState(['Fossil Fuel'])
  const [selectedfossilFuelSubTypes , setSelectedfossilFuelSubTypes] = useState(['Coal', 'Oil', 'Gas', 'Oil and Gas', 'CCS', 'Hydrogen'])
  const [aggregationType, setAggregationType] = useState('average')
  const [yearType, setYearType] = useState('custom')
  const [customYears, setCustomYears] = useState([2017, finalYear])
  const [scopeType, setScopeType] = useState('both')
  const sections = [
    {
      title: 'Public Finance by Year',
      orderMultiColumnView: 0,
      description: <React.Fragment>This includes finance by year and energy type, from MDBs, G20 ECAs, G20 DFIs, G20 NDBs, and national governments. You can use the top dashboard to select just international or domestic finance, as well as to include or exclude the subsidies. Filter to select a specific country or MDB. Annual financing totals and data availability are often variable at individual institutions, so please use filtered results with caution. Read our <Link to='/about'>About page</Link> for more information on our data and methodology.</React.Fragment>,
      content: (
        data.length ? <YearlyUsageGraph data={data} /> : null
      )
    },
    {
      title: 'Top 15 G20 Country Comparison',
      orderMultiColumnView: 1,
      description: 'The 15 countries with the largest flows of international and domestic public finance for energy as well as domestic subsidies for CCS and fossil hydrogen, based on your dashboard selections. This includes finance from bilateral ECAs and DFIs, but not G20 country contributions to MDBs, as these cannot be disaggregated. For any non-G20 countries that appear, the data below is only their CCS and fossil hydrogen subsidies. Hover over each country label to see the institutions included.',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind !== 'Multilateral')} />
      )
    },
    {
      title: 'Multilateral Development Banks Comparison',

      orderMultiColumnView: 3,
      description: 'Public energy finance from the major MDBs. Note that G20 countries are collectively major shareholders of each of these institutions, but that many other countries hold shares as well. Hover over each bank label to see the institutions included.',
      content: (
        <TopUsageGraph isBank data={data.filter(d => d.institutionKind === 'Multilateral')} />
      )
    },

    {
      title: 'Export Credit Agencies Comparison',

      orderMultiColumnView: 5,
      description: 'Public energy finance from G20 ECAs, by country. ECAs are focused on trade finance and typically have a mandate to promote the export of goods and services from their country. Hover over each country label to see the institutions included.',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind === 'Export Credit')} />
      )
    },

    {
      title: 'Development Finance Institutions Comparison',
      orderMultiColumnView: 2,
      description: 'Public energy finance from G20 DFIs, by country. Hover over each country label to see the institutions included.',
      column: 'right',
      content: (
        <TopUsageGraph data={data.filter(d => d.institutionKind === 'Bilateral')} />
      )
    },
    {
      title: 'Public Finance by Country',
      column: 'left',
      orderMultiColumnView: 4,
      description: `Where G20 and MDB public finance for energy is flowing, grouped either by recipient or financing country (use toggle below). Click on “Clean” or Other” to see non-fossil fuel finance flows. Hover over each country to see flow amounts. For domestic finance and CCS and fossil hydrogen subsidies, the recipient and financing country will be the same.`,
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

  if (!width) {
    return null
  }
  const singleColumnView = width < 1100

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
          selectedfossilFuelSubTypes,
          aggregationType,
          yearType,
          customYears,
          scopeType,
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
<p>This dashboard shows the total flows of: </p>
<ul>
<li>Fossil fuel, clean, and other energy projects from G20 countries’ export credit agencies (ECAs), development finance institutions (DFIs), between 2013 and 2025</li>
<li>Fossil fuel, clean, and other energy projects from G20 countries’ national development banks (NDBs), between 2016 and 2024</li>
<li>Fossil fuel, clean, and other energy projects from major multilateral development banks (MDBs)</li>
<li>CCS and hydrogen domestic government subsidies</li>
</ul>
<p>How to use this dashboard: Use the controls below to add or remove data on fossil fuel, clean, and other energy, change the years displayed, show totals rather than annual averages, and toggle between domestic finance, international finance, and all finance.</p>
<p>Note: To see just the CCS and hydrogen subsidies, select just “CCS and fossil hydrogen” from the list of fossil fuel categories and “Domestic Finance” from the International or Domestic toggle.</p>
<p>For details on our methodology, see the About page.</p>
<p><strong>If you would like to explore the data yourself at the transaction level, you can <a href={`${process.env.PUBLIC_URL}/${downloadPath}`}>download the full dataset as a spreadsheet here (.xlsx file)</a>.</strong></p>
<p><strong>If you would like to explore the CCS and fossil hydrogen subsidies database yourself at the transaction level, you can <ExLink href="https://docs.google.com/spreadsheets/d/1eiwqktp_LzMK3wYYZe71KzlAF7WCMOfv545tzZC96eA/edit?gid=1616263255#gid=1616263255">download the CCS and fossil hydrogen dataset as a spreadsheet here</ExLink>.</strong></p>

<p>An asterisk (*) indicates that very limited or no direct reporting is available from this country or institution.</p>
        </div>
      </div>
      <div className='controls'>

        <YearPicker
          value={yearType}
          onChange={e => setYearType(e.target.value)}
          customYears={customYears}
          setCustomYears={setCustomYears}
        />
        <ScopePicker
          value={scopeType}
          onChange={e => setScopeType(e.target.value)}
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
        <div className='fossilFuelSubTypes'>
          {fossilFuelSubTypes.map(type => {
            const enabled = selectedfossilFuelSubTypes.includes(type)
            const isOther = type === 'Other'
            const dataTip = isOther ? `<div><div style="font-weight: bold">Other energy type:</div>This includes large hydropower, nuclear, and biomass projects as well as energy spending that cannot be specifically linked to a source of energy (most frequently this is for electricity transmission and distribution projects).</div>` : null
            return (
              <label className='fossilFuelSubTypeToggle' key={type} style={{ backgroundColor: '#000000', color:'#fff',  opacity: enabled ? null : 0.35 }} onClick={ () => {

                  const newFossilFuelSubtypesSelected = selectedfossilFuelSubTypes.includes(type) ?
                    selectedfossilFuelSubTypes.filter(t => t !== type) :
                    [...selectedfossilFuelSubTypes, type]
                  if (newFossilFuelSubtypesSelected.length === 0) {
                    return selectedfossilFuelSubTypes
                  }
                  newFossilFuelSubtypesSelected.sort((a, b) => {
                    const aIndex = energyTypes.indexOf(a)
                    const bIndex = energyTypes.indexOf(b)
                    return aIndex - bIndex
                  })

                  setSelectedfossilFuelSubTypes(newFossilFuelSubtypesSelected)
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
