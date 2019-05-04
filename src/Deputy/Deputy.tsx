import React, { useState, useEffect } from "react";
import { getDeputy } from "lbp-wrapper";
import Helmet from "react-helmet";

interface RouterProps<T> {
  match: {
    params: T;
  };
}

interface RouterParams {
  id: string;
}

function getGender(deputy: IDeputy) {
  if (deputy.sexe === "H") {
    return "Député";
  } else {
    return "Députée";
  }
}

function Deputy(props: RouterProps<RouterParams>): JSX.Element {
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
    <div>
      <Helmet>
        <title>
          {deputy.prenom} {deputy.nom_de_famille} - {getGender(deputy)}{" "}
          {deputy.groupe_sigle}
        </title>
      </Helmet>
      <img src={deputy.imageDynamic(200)} alt="" />
      <h1>
        {deputy.prenom} {deputy.nom_de_famille}
      </h1>
      <p>
        {getGender(deputy)} {deputy.groupe_sigle}
      </p>
      <p>
        {deputy.nom_circo} ({deputy.num_circo})
      </p>
    </div>
  );
}

export default Deputy;
