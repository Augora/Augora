import React from "react";
// import { RouterProps } from "../../../Utils/utils";
import styled from "styled-components";

const Column = styled.div`
  flex: 50%;
  max-width: 50%;
  padding: 0 4px;
  text-align: center;

  @media screen and (max-width: 1200px) {
    flex: 50%;
    max-width: 50%;
  }

  @media screen and (max-width: 600px) {
    flex: 100%;
    max-width: 100%;
  }
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 4px;
`;

const Image = styled.img`
  margin-top: 8px;
  vertical-align: middle;
  width: 25%;
  text-align: center;
`;

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

function GeneralInformation(props: IGeneralInformation) {
  return (
    <div>
      <Row>
        <Column>
          <Image alt="deputy-photo" src={props.picture} />
        </Column>
        <Column>
          <Image alt="deputy-group-photo" src={props.pictureGroup} />
        </Column>
      </Row>
      <Row>

        <Column>
        <h1>
        {" "}
        {props.firstName} {props.lastName}{" "}
      </h1>
      <p>
        {props.gender} {props.groupSymbol}
      </p>
      <p>
        {props.circonscriptionName} ({props.circonscriptionNumber})
      </p>

        </Column>
      </Row>
    </div>
  );
}

export default GeneralInformation;
