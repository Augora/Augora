import React from "react";
import block, {MyState} from "../../../Utils/sc-utils";
import styled from "styled-components";

export interface ICurrentMandate {
    isInMandate: boolean;
    dateBegin: string;
    numberMandates: number;
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
        var date = new Date(this.props.dateBegin);

        var dateToDisplay = '';
        if(date.getDay() < 10) {
            dateToDisplay += '0' + date.getDay();
        } else {
            dateToDisplay += date.getDay();
        }

        dateToDisplay += ' ';

        if(date.getMonth() < 10) {
            dateToDisplay += '0' + date.getMonth();
        } else {
            dateToDisplay += date.getMonth();
        }

        dateToDisplay += ' ' + date.getFullYear();
        if(this.props.isInMandate === true) {
            return (
                <Block>
                    <Title>
                        Mandat en cours
                    </Title>
                    <DateMandate>
                        Depuis le {dateToDisplay} 
                    </DateMandate>
                    <P>
                    Nombre de mandats totaux : {this.props.numberMandates}
                    </P>
                </Block>
            );
        } else {
            return (
                <Block>
                    <Title>
                        Pas de mandat en cours
                    </Title>
                    <P>
                        Nombre de mandats totaux : {this.props.numberMandates}
                    </P>
                </Block>
            )
        }
    }
}

export default CurrentMandate;
