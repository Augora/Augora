import React from "react";
import block, {MyState} from "utils/styled-components/block";
import styled from "styled-components";
import moment from "moment";
import 'moment/locale/fr';

export interface ICurrentMandate {
    isInMandate: boolean;
    dateBegin: string;
}

class CurrentMandate extends React.Component<ICurrentMandate, MyState>{

    constructor(props: ICurrentMandate) {
        super(props)
    
        this.state = {
          blockSize: 'block'
        }
    }
    render() {
        const Block = styled.div`
        display: flex;
        flex-direction: column;
        grid-column-end: span 1;
        background-color: rgba(0,0,0,0.15);
        border: solid 2px rgba(0,0,0,0.25);
        border-radius: 2px;
        padding: 10px;
      `;
        const Title = styled.h2`
        `;
        
        const P = styled.p`
        margin: 0;
        `

        const DateMandate = styled.p`
        margin: 0;
        `

       moment.locale('fr');
       var dateToDisplay = moment(this.props.dateBegin).format('Do MMMM YYYY');
        if(this.props.isInMandate === true) {
            return (
                <Block>
                    <Title>
                        Mandat en cours
                    </Title>
                    <DateMandate>
                        Depuis le {dateToDisplay} 
                    </DateMandate>
                </Block>
            );
        } else {
            return (
                <Block>
                    <Title>
                        Pas de mandat en cours
                    </Title>
                </Block>
            )
        }
    }
}

export default CurrentMandate;
