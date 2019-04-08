import React, { Component } from 'react';
import { getDeputy } from 'lbp-wrapper';

class SingleDeputy extends Component {
    constructor(...props) {
        super(...props);

        this.state = {
            isLoading: true,
            data: null,
            error: null
        };
    }

    componentDidMount() {
        const _this = this;
        getDeputy(this.props.match.params.id).then(d =>
            _this.setState(state =>
                Object.assign({}, state, { isLoading: false, data: d })
            )
        );
    }

    render() {
        if (!this.props.match) {
            throw new Error('SingleDeputy: please provide a match parameter.');
        }
        if (this.state.isLoading) {
            return <h1>Loading...</h1>;
        }
        return (
            <div>
                <h1>SingleDeputy: {this.props.match.params.id}</h1>
                <img
                    src={this.state.data.entities.depute[1].imageDynamic(200)}
                />
            </div>
        );
    }
}

export default SingleDeputy;
