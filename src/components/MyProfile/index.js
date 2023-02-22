import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import Header from '../Header'
import Profile from '../Profile'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MyProfile extends Component {
  state = {myProfileData: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount = () => {
    this.getMyProfileData()
  }

  getMyProfileData = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/insta-share/my-profile'

    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const proData = data.profile
      const profileData = {
        id: proData.id,
        userId: proData.user_id,
        userName: proData.user_name,
        profilePic: proData.profile_pic,
        followersCount: proData.followers_count,
        followingCount: proData.following_count,
        userBio: proData.user_bio,
        posts: proData.posts,
        postsCount: proData.posts_count,
        stories: proData.stories,
      }
      this.setState({
        myProfileData: profileData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderMyProfileView = () => {
    const {myProfileData} = this.state
    return <Profile profileDetails={myProfileData} owner="my" />
  }

  renderLoadingView = () => (
    <>
      <Header />
      <div
        className="user-profile-loader-container"
        // eslint-disable-next-line react/no-unknown-property
        testid="loader"
      >
        <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
      </div>
    </>
  )

  renderFailureView = () => (
    <>
      <Header />
      <div className="user-profile-loader-container">
        <img
          className="user-profile-error-image"
          alt="failure view"
          src="https://res.cloudinary.com/aneesmon/image/upload/v1648988134/Insta_Share/failure-image_hzoet8.png"
        />
        <p className="user-profile-error-message">
          Something went wrong. Please try again
        </p>
        <button
          className="user-profile-error-button"
          type="button"
          onClick={this.getMyProfile}
        >
          Try again
        </button>
      </div>
    </>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderMyProfileView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default MyProfile
