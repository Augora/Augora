import React, { useState, useEffect } from "react";
import { getDeputy } from "lbp-wrapper";

interface RouterProps<T> { 
  match: {
    params: T;
  };
}

interface RouterParams {
  id: string;
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
      <h1>Deputy: {props.match.params.id}</h1>
      <img src={deputy.imageDynamic(200)} alt="" />
    </div>
  );
}

export default Deputy;
