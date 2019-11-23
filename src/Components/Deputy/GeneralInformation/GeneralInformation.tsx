import React from "react";
import block, {MyState} from "Utils/sc-utils";

// import { RouterProps } from "../../../Utils/utils";
import styled from "styled-components";

export interface IGeneralInformation {
  id: number;
  firstName: string;
  lastName: string;
  picture: string;
  pictureGroup: string;
  circonscriptionNumber: number;
  circonscriptionName: string;
  gender: string;
  groupSymbol: string;
}

export default class GeneralInformation extends React.Component<IGeneralInformation, MyState> {
  constructor(props: IGeneralInformation) {
    super(props)

    this.state = {
      blockSize: 'halfLine'
    }
  }

  render() {
    const Block = block(this);
    const Photo = styled.img`
      object-fit: contain;
      width: 100%; width: calc(50% - 10px);
    `;
    const GeneralText = styled.div`
      width: calc(50% - 10px);
    `
    const LogoGroup = styled.img`
      object-fit: contain;
      width: 100%; height: 50%;
    `;
    const Name = styled.h1`
      margin: 0 0 10px;
      line-height: 1;
    `
    const P = styled.p`
      margin: 0;
    `
    return (
      <Block className="deputy__block">
        <Photo
          className="single-deputy__photo"
          src={this.props.picture}
          alt="deputy-photo"
        />
        <GeneralText className="single-deputy__general-text">
          <LogoGroup
            className="single-deputy__logo-groupe"
            src={this.props.pictureGroup}
            alt="deputy-group-photo"
          />
          <Name className="single-deputy__name">
            {this.props.firstName} {this.props.lastName}
          </Name>
          <P>
            {this.props.gender} {this.props.groupSymbol}
          </P>
          <P>
            {this.props.circonscriptionName} ({this.props.circonscriptionNumber})
          </P>
        </GeneralText>
      </Block>
    );
  }
}
