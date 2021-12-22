import './styles.scss'
import ReactMarkdown from 'react-markdown'
import { useState, useEffect } from 'react'
import classNames from 'classnames'
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
  const c = {
    img: (node, inline, className, children, ...props) => {
      return <div className='imageContainer'><img src={node.src} alt={node.alt} title={node.title}  /></div>
    },
    p: (node, inline, className, children, ...props) => {
      const hasImage = node.children.some(child => child && child.props && child.props.node && child.props.node.tagName === 'img')
      return <p className={classNames({hasImage})}>{node.children}</p>
    }
  }
  return (
    <div className='Research' style={{ marginTop: headerHeight}}>
      <ReactMarkdown components={c} linkTarget='_blank' transformImageUri={imageURI}>{researchMarkdown}</ReactMarkdown>
    </div>
  )
}
