import "./Barometre.css"

function Barometre(props) {
    const { diades, puntuacions } = props;

    let castells_puntuats = {};
    let pilars_puntuats = {};

    const parseProfile = points => {
        if (points < 300) return "grup0";
        else if (points < 500) return "grup1";
        else if (points < 750) return "grup2";
        else if (points < 1200) return "grup3";
        else if (points < 1600) return "grup4";
        else if (points < 2500) return "grup5";
        else if (points < 3500) return "grup6";
        else if (3500 <= points) return "grup7";

        return "";
    };

    const isCarregat = castell => {
        if (castell.slice(-1) == "C") return " carregat";
        return "";
    }

    // TODO: check if first castell was done the past week
    const donePastWeek = date => {
        return "";
        return "new";
    }

    const fromEuropean = (dateString) => {
        const [day, month, year] = dateString.split("/");
        return new Date(`${month}/${day}/${year}`);
    };

    const getLastSeptember = (today) => {
        if (today.getMonth() >= 9-1) {
            return new Date(`09/01/${today.getFullYear()}`);
        } else {
            return new Date(`09/01/${today.getFullYear()-1}`);
        }
    };

    const llista_diades = [...Object.values(diades)];
    const aquesta_temporada = llista_diades.filter(diada => fromEuropean(diada["info"]["DATA"]) > getLastSeptember(new Date()))
    aquesta_temporada.map(diada => {
        const colles = Object.keys(diada["colles"]);
        colles.map(colla => {
            diada["colles"][colla].map(castell => {
                if (castell["CASTELL"] in puntuacions && (castell["RESULTAT"] === "Descarregat" || castell["RESULTAT"] === "Carregat")) {
                    const punts = puntuacions[castell["CASTELL"]][castell["RESULTAT"]];

                    let res = "";
                    if (castell["RESULTAT"] === "Carregat")
                        res = "C";
                    
                    if (castell["CASTELL"].toLowerCase().startsWith("p") || castell["CASTELL"].toLowerCase().startsWith("v")) {
                        if (!(colla in pilars_puntuats)) pilars_puntuats[colla] = {};
                        pilars_puntuats[colla][castell["CASTELL"]+res] = punts;
                    } else {
                        if (!(colla in castells_puntuats)) castells_puntuats[colla] = {};
                        castells_puntuats[colla][castell["CASTELL"]+res] = punts;
                    }
                }
            })
        })
    });

    const top3 = Object.keys(castells_puntuats).map(colla => {
        return {
            "colla": colla,
            "puntuacio_total": Object
                .entries(castells_puntuats[colla]) // create Array of Arrays with [key, value]
                .sort(([, a],[, b]) => b-a) // sort by value, descending (b-a)
                .slice(0,3) // return only the first 3 elements of the intermediate result
                .map(([a,b]) => parseInt(b))
                .reduce((acc, curr) => acc + curr, 0),
            "puntuacions": Object
                .entries(castells_puntuats[colla]) // create Array of Arrays with [key, value]
                .sort(([, a],[, b]) => b-a) // sort by value, descending (b-a)
                .slice(0,3) // return only the first 3 elements of the intermediate result
                .map(([a,b]) => parseInt(b)),
            "top3": colla in castells_puntuats ? Object
                .entries(castells_puntuats[colla]) // create Array of Arrays with [key, value]
                .sort(([, a],[, b]) => b-a) // sort by value, descending (b-a)
                .slice(0,3) // return only the first 3 elements of the intermediate result
                .map(([n])=> n) : ["-", "-", "-"], // and map that to an array with only the name
            "topPilar": colla in pilars_puntuats ? Object
                .entries(pilars_puntuats[colla]) // create Array of Arrays with [key, value]
                .sort(([, a],[, b]) => b-a) // sort by value, descending (b-a)
                .slice(0,1) // return only the first 3 elements of the intermediate result
                .map(([n])=> n) : "-", // and map that to an array with only the name
            "topPilarPuntuacio": colla in pilars_puntuats ? Object
                .entries(pilars_puntuats[colla]) // create Array of Arrays with [key, value]
                .sort(([, a],[, b]) => b-a) // sort by value, descending (b-a)
                .slice(0,1) // return only the first 3 elements of the intermediate result
                .map(([, n])=> parseInt(n)) : "0" // and map that to an array with only the name
        };
    });
    
    return (
        <>
            <h1>Baròmetre Universitari: Temporada 2022-23</h1>
            <h2>(Actualitzat a 24 novembre 2022)</h2>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Colla</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
            {
                top3
                .sort((a,b) => a.puntuacio_total < b.puntuacio_total ? 1 : -1)
                .map((colla, i) => {
                    return (
                        <tr className="colla" key={colla.colla}>
                            <td>{i+1}</td>
                            <td className={colla.colla.toLowerCase()}>{colla.colla}</td>
                            {colla.top3.map((castell, i) => {
								return (
                                    <>
                                        <td className={donePastWeek('')}></td>
                                        <td key={castell} className={"castell " + parseProfile(colla.puntuacions[i]) + isCarregat(castell)}>{castell}</td>
                                    </>
                                );
							})}
                            <td className={donePastWeek('')}></td>
                            <td className={"castell " + parseProfile(colla.topPilarPuntuacio) + isCarregat(colla.topPilar[0])}>{colla.topPilar[0]}</td>
                        </tr>
                    );
                })
            }
                </tbody>
            </table>
        </>
    );
}

export default Barometre;