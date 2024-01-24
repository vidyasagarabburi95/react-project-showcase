import './index.css'

const ProjectShowCase = props => {
  const {details} = props
  const {name, imageUrl, id} = details
  return (
    <li key={id}>
      <img src={imageUrl} alt={name} />
      <p>{name}</p>
    </li>
  )
}
export default ProjectShowCase
