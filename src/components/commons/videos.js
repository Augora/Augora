import React, { Component } from 'react';
import Axios from 'axios';
import Video from './video.js';

class Videos extends Component {
  constructor(...props) {
    super(...props);

    this.getLatestVideos = this.getLatestVideos.bind(this);

    this.state = {
      videosIds: [],
      intervalId: null,
    };
  }

  componentDidMount() {
    const intervalId = window.setInterval(this.getLatestVideos, 1000);
    this.setState({
      intervalId,
    });
  }

  componentWillUnmount() {
    window.clearInterval(this.state.intervalId);
  }

  getLatestVideos() {
    const { urls } = this.props;
    const _this = this;
    Axios.get(urls).then((result) => {
      _this.setState({
        videosIds: result.data.items.map(item => item.id.videoId),
      });
    });
  }

  render() {
    console.log(this.state, this.props.urls);
    if (this.state.videosIds.length === 0) {
      return <h2>Loading...</h2>;
    }
    return (
      <div>
        <h1>Videos</h1>
        {this.state.videosIds.map(videoId => <Video key={videoId} id={videoId} />)}
      </div>
    );
  }
}

export default Videos;
