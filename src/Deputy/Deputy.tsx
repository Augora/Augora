import React, { useState, useEffect } from "react";
import { getDeputy } from "lbp-wrapper";
import Helmet from "react-helmet";
import GeneralInformation from "../Components/Deputy/GeneralInformation/GeneralInformation";
import { RouterProps } from "../Utils/utils";
import {
  getGender,
  getGeneralInformation,
  // getCoworkers
} from "./Utils/Deputy.utils";
// import Coworkers from "../Components/Deputy/Coworkers/Coworkers";
import styled from "styled-components";

const DeputyStyles = styled.div`
`;

interface RouterParams {
  id: string;
}

function Deputy(props: RouterProps<RouterParams>) {
  const [deputy, setDeputy] = useState<IDeputy | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getDeputy(props.match.params.id).then(d => {
      setDeputy(d);
      setIsLoading(false);
    });
  }, [props.match.params.id]);

  if (isLoading || deputy === null) {
    return <h1>Loading...</h1>;
  }

  return (
    <DeputyStyles>
      <Helmet>
        <title>
          {deputy.prenom} {deputy.nom_de_famille} - {getGender(deputy)}{" "}
          {deputy.groupe_sigle}
        </title>
      </Helmet>
      <GeneralInformation {...getGeneralInformation(deputy, 500)} />
      {/* <Coworkers {...getCoworkers(deputy)} /> */}
    </DeputyStyles>
  );
}

export default Deputy;
