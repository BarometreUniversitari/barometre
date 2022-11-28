import React from "react";
import "./DataFormatter.css";

function DataFormatter(props) {
    const { diades } = props;

    return (
        [...Object.values(diades)].map(diada => {
            return (
                <div className="diada">
                    <h2 className="data">{diada["info"]["Data"]}</h2>
                    <h2 className="nom">{diada["info"]["Nom"]}</h2>
                    <h2 className="lloc">{diada["info"]["Lloc"]}</h2>
                    <div className="colles">
                        {Object.keys(diada["colles"]).map(colla => {
                            return (
                                <div className="colla" key={colla}>
                                    <h3>{colla}</h3>
                                    <div className="castells">
                                        {diada["colles"][colla].map(castell => {
                                            return (
                                                <div className="castell">
                                                    <div className="ronda">{castell["Ronda"]}</div>
                                                    <div className="castell">{castell["Castell"]}</div>
                                                    <div className="resultat">{castell["Resultat"]}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )
        })
    );
}

export default DataFormatter;