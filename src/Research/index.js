import './styles.scss'
import ReactMarkdown from 'react-markdown'
import { useState, useEffect } from 'react'
export default function Research(props) {
  const { headerHeight } = props
  const [researchMarkdown, setResearchMarkdown] = useState('')
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/Research.md`)
      .then(res => res.text())
      .then(text => setResearchMarkdown(text))
  }, [])
  const imageURI = (src, alt, title) => {
    return `${process.env.PUBLIC_URL}/${src}`
  }
  return (
    <div className='Research' style={{ marginTop: headerHeight}}>
      <ReactMarkdown linkTarget='_blank' transformImageUri={imageURI}>{researchMarkdown}</ReactMarkdown>
    </div>
  )
}
