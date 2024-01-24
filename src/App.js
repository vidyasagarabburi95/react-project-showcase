import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectShowCase from './components/ProjectShowCase'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatus = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  fail: 'fail',
}

class App extends Component {
  state = {
    status: apiStatus.initial,
    selected: 'ALL',
    data: [],
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    this.setState({status: apiStatus.loading})
    const {selected} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${selected}`
    const options = {
      method: 'GET',
    }

    try {
      const response = await fetch(url, options)

      if (response.ok === true) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.projects.map(each => ({
          id: each.id,
          name: each.name,
          imageUrl: each.image_url,
        }))
        this.setState({status: apiStatus.success, data: updatedData})
      } else {
        this.setState({status: apiStatus.fail})
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      this.setState({status: apiStatus.fail})
    }
  }

  dropDown = event => {
    this.setState({selected: event.target.value}, this.fetchData)
  }

  loadingView = () => (
    <div data-testid="loader" className="load">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  successView = () => {
    const {data} = this.state
    return (
      <div>
        <ul>
          {data.map(each => (
            <ProjectShowCase key={each.id} details={each} />
          ))}
        </ul>
      </div>
    )
  }

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />

      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.fetchData}>
        Retry
      </button>
    </div>
  )

  finalRender = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.loading:
        return this.loadingView()
      case apiStatus.success:
        return this.successView()
      case apiStatus.fail:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {selected} = this.state

    return (
      <div>
        <nav>
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div>
          <ul>
            <select onChange={this.dropDown} value={selected}>
              {categoriesList.map(each => (
                <option key={each.id} value={each.id}>
                  {each.displayText}
                </option>
              ))}
            </select>
          </ul>
        </div>
        {this.finalRender()}
      </div>
    )
  }
}

export default App
