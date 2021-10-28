import './styles.scss'
import useWindowSize from '../hooks/useWindowSize'
import classNames from 'classnames'
import React from 'react'
import TopUsageGraph from './TopUsageGraph'
import YearlyUsageGraph from './YearlyUsageGraph'
const loremIpsum = `Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum. Sed ut perspiciatis unde omnis istpoe natus error sit voluptatem accusantium doloremque eopsloi laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunot.`
export default function DataView(props) {
  const { data } = props
  console.log(data)
  const sections = [
    {
      title: 'Energy Investment 2014-2020',
      column: 'left',
      content: (
        data.length ? <YearlyUsageGraph data={data} /> : null
      )

    },
    {
      title: 'Top 12 G20 Country Comparison 2014-2020',
      column: 'right',
      content: (
        <TopUsageGraph data={data.filter(d => d.isCountry)} />
      )
    },
    {
      title: 'MDB Comparison 2014-2020',
      column: 'right',
      content: (
        <TopUsageGraph isBank data={data.filter(d => d.isBank)} />
      )
    },
    {
      title: 'Energy investment recipient country',
      column: 'left',
    },
  ]
  sections.forEach((s, i) => s.index = i)

  const {width, height} = useWindowSize()
  console.log(width)
  if (!width) {
    return null
  }
  const singleColumnView = width < 768

  const sectionWidth = singleColumnView ? width - 20 - 16 * 4 : (width - 16 * 4 - 20) / 2
  const renderSection = (section) => {
    const description = section.description || loremIpsum
    let defaultContent = <svg width={sectionWidth} height={200 + section.index * 50} />
    let content = section.content ?
      React.cloneElement(section.content, {width: sectionWidth, height: 200}) :
      defaultContent
    return (
      <section key={section.title}>
        <h2>{section.title}</h2>
        <div>{description}</div>
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
    <div className={classNames('DataView', { twoColumnView: !singleColumnView })}>
      {sectionDivs}
    </div>
  )
}