import React from "react";
import block, {MyState} from "Utils/sc-utils";
import styled from "styled-components";
import moment from "moment";
import 'moment/locale/fr';

export interface IOthersMandates {
   othersMandates : [string]
}

class OthersMandates extends React.Component<IOthersMandates, MyState>{

    constructor(props: IOthersMandates) {
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
        `;

        const OtherMandate = styled.p`
        margin: 0;
        `;

       moment.locale('fr');
    //    var dateToDisplay = moment(this.props.dateBegin).format('Do MMMM YYYY');
            return (
                <Block>
                    <Title>
                        Autres mandats
                    </Title>
                    {this.props.othersMandates.map(otherMandate => {
                        // deprecated after fix in backend, to change later
                        var infos = otherMandate.split(" / ");
                        return( 
                        <OtherMandate>
                          {infos[0]} - {infos[1]} - {infos[2]}
                        </OtherMandate>);
                    })}
                </Block>
            );
        
    }
}

export default OthersMandates;
