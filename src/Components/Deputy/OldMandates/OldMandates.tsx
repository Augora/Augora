import React from "react";
import block, {MyState} from "Utils/sc-utils";
import styled from "styled-components";
import moment from "moment";
import 'moment/locale/fr';

export interface IOldMandates {
   oldMandates : [string]
}

class OldMandates extends React.Component<IOldMandates, MyState>{

    constructor(props: IOldMandates) {
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

        console.log(this.props.oldMandates);
        
       moment.locale('fr');
    //    var dateToDisplay = moment(this.props.dateBegin).format('Do MMMM YYYY');
            return (
                <Block>
                    <Title>
                        Anciens mandats
                    </Title>
                    {this.props.oldMandates.map(oldMandate => {
                        console.log(oldMandate);
                        var infos = oldMandate.split(" / ");
                        if(infos[1] !== '') {
                            if(infos[2] !== '') {
                                return (
                                    <DateMandate>
                                       Du {moment(infos[0], 'DD/MM/YYYY', true).format('Do MMMM YYYY')} au {moment(infos[1], 'DD/MM/YYYY', true).format('Do MMMM YYYY')} : {infos[2]}
                                    </DateMandate>
                                    );
                            }
                        }
                        
                    })}
                </Block>
            );
        
    }
}

export default OldMandates;
