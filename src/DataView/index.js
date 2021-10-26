import './styles.scss'
import useWindowSize from '../hooks/useWindowSize'
import classNames from 'classnames'
import React from 'react'
export default function DataView(props) {
  const { data } = props
  console.log(data)
  const sections = [
    {
      title: 'Energy Investment average 2014-2020',
      column: 'left',
    },
    {
      title: 'Top 12 G20 Country Comparison 2014-2020',
      column: 'right',
    },
    {
      title: 'MDB Comparison 2014-2020',
      column: 'right',
    },
    {
      title: 'Energy investment recipient country',
      column: 'left',
    },
  ]
  sections.forEach((s, i) => s.index = i)

  const {width, height} = useWindowSize()
  const singleColumnView = width < 768

  const sectionWidth = singleColumnView ? width - 20 : width / 2
  const renderSection = (section) => {
    return (
      <section key={section.title}>
        <h2>{section.title}</h2>
        <svg width={sectionWidth} height={200 + section.index * 50} />
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
    <div className={classNames('DataView', { twoColumnView: !singleColumnView })}>
      {sectionDivs}
    </div>
  )
}