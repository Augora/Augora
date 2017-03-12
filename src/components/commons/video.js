import React, {Component} from 'react';

class Video extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.id !== nextProps.id;
  }

  render() {
    console.log('Video:render')
    return (
      <div>
        <iframe width="420" height="315" src={`https://www.youtube.com/embed/${this.props.id}`}></iframe>
      </div>
    );
  }
}

export default Video;
