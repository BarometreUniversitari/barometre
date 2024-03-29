import { Component } from "react";
import COLLES_INICIALS from "./../data/colles.json";
import GetTemporada from "./../functions/GetTemporada";
import GetHighContrast from "./../functions/GetHighContrast";

class LlistaDiades extends Component {
	render() {
		const { diades } = this.props;

		const colors_colla = COLLES_INICIALS[GetTemporada(new Date())];

		const fromEuropean = (dateString) => {
			const [day, month, year] = dateString.split("/");
			return new Date(`${month}/${day}/${year}`);
		};

		const areThereCastellsInRonda = (diada_colles, ronda) => {
			const castells = [...Object.values(diada_colles)];
			for (const c of castells)
				for (const cc of c)
					if (cc['RONDA'] === ronda) return true;
			return false;
		};

		const getCastellsRonda = function (castells, ronda) {
			let castells_of_round = [];
			for (const castell of castells)
				if (castell["RONDA"] === ronda) castells_of_round.push(castell)
			return castells_of_round;
		};

		const count = (obj) => {
			return Object.keys(obj).length;
		};

		const parseCastells = (castells) => {
			let res = {};
			for (const castell of castells) {
				let name = castell["CASTELL"];
				if (castell["RESULTAT"] === "Carregat")
					name += "C"
				else if (castell["RESULTAT"] === "Intent desmuntat")
					name = "id" + name;
				else if (castell["RESULTAT"] === "Intent")
					name = "i" + name;

				if (name in res)
					res[name] += 1;
				else
					res[name] = 1;
			}
			return formatRonda(res);
		};

		const formatRonda = (castellsDict) => {
			const special = specialRounds(castellsDict);
			if (special !== false)
				return special;
			let res = "";
			for (const [castell, amount] of Object.entries(castellsDict))
				res += formatCastell(amount, castell) + "+";
			return res.slice(0,-1);
		};

		const formatCastell = (amount, castell) => {
			return (amount === 1 ? "" : amount) + castell;
		};

		const specialRounds = (castellsDict) => {
			if (count(castellsDict) === 2 &&
				"Pd4" in castellsDict && castellsDict["Pd4"] === 2 &&
				"Pd5" in castellsDict && castellsDict["Pd5"] === 1)
				return "Vd5";
			if (count(castellsDict) === 2 &&
				"Pd3" in castellsDict && castellsDict["Pd3"] === 2 &&
				"Pd4" in castellsDict && castellsDict["Pd4"] === 1)
				return "Vd4";
			if (count(castellsDict) === 2 &&
				"3d6a" in castellsDict &&
				"4d6a" in castellsDict)
				return "3i4d6asim";
			if (count(castellsDict) === 2 &&
				"3d6" in castellsDict &&
				"4d6" in castellsDict)
				return "3i4d6sim";
			return false;
		};

		const validClass = (castells) => {
			if (castells.length === 0) return "";
			for (let castell of castells)
				if (!castell.CASTELL.includes("(") && !castell.CASTELL.includes("n")) return "";
			return "invalid";
		};

		const isFromTemporada = (date, temporada) => {
			const start_temporada = new Date(`09/01/${temporada.split('-')[0]}`);
			const end_temporada = new Date(`08/31/${temporada.split('-')[1]}`);
			return start_temporada <= date && date <= end_temporada;
		};

		const getTemporada = (data) => {
			let year;
			try {
				year = data.getFullYear();
			} catch {
				data = fromEuropean(data);
				year = data.getFullYear();
			}
			
			if (isFromTemporada(data, year+'-'+(year+1)))
				return year+'-'+(year+1);
			return (year-1)+'-'+year;
		};

		const llista_diades = [...Object.values(diades)].filter(d => isFromTemporada(fromEuropean(d["info"]["DATA"]), getTemporada(new Date())));
		llista_diades.sort((a,b) => fromEuropean(b["info"]["DATA"]) - fromEuropean(a["info"]["DATA"]));

		return (<>
			<section>
				<h2 style={{marginBottom: '1rem'}}>Llista de diades universitàries</h2>
				{
					llista_diades.length === 0 ? <h5>(Encara no s'han fet castells aquesta temporada)</h5> : <></>
				}
				{
					llista_diades.map((diada, _) => {
						const areEntrada = areThereCastellsInRonda(diada["colles"], "Entrada");
						const are1 = areThereCastellsInRonda(diada["colles"], "1");
						const are2 = areThereCastellsInRonda(diada["colles"], "2");
						const are3 = areThereCastellsInRonda(diada["colles"], "3");
						const are4 = areThereCastellsInRonda(diada["colles"], "4");
						const are5 = areThereCastellsInRonda(diada["colles"], "5");
						const arePilar = areThereCastellsInRonda(diada["colles"], "Pilar");
						const areSortida = areThereCastellsInRonda(diada["colles"], "Sortida");
						const colles = Object.keys(diada["colles"]).map(function(key) {
							return [key, diada["colles"][key]];
						});
						colles.sort((a, b) => {
							const ordreA = a[1]["ordre"];
							const ordreB = b[1]["ordre"];
							return ordreA - ordreB;
						});
						return (
							<>
								<h5>{diada["info"]["DIADA"]}</h5>
								<h6>{diada["info"]["DATA"] + " - " + diada["info"]["LLOC"]}</h6>
								<div className="table-wrap"><table className="list-tb">
									<thead>
										<tr>
											<th>Colla</th>
											{ areEntrada && <th>Entrada</th> }
											{ are1 && <th>Ronda #1</th> }
											{ are2 && <th>Ronda #2</th> }
											{ are3 && <th>Ronda #3</th> }
											{ are4 && <th>Ronda #4</th> }
											{ are5 && <th>Ronda #5</th> }
											{ arePilar && <th>Pilar</th> }
											{ areSortida && <th>Sortida</th> }
										</tr>
									</thead>
									<tbody>
										{
											colles.map((colla, i) => {
												const castells = colla[1];
												const entrada = parseCastells(getCastellsRonda(castells, "Entrada"));
												const round1 = parseCastells(getCastellsRonda(castells, "1"));
												const round2 = parseCastells(getCastellsRonda(castells, "2"));
												const round3 = parseCastells(getCastellsRonda(castells, "3"));
												const round4 = parseCastells(getCastellsRonda(castells, "4"));
												const round5 = parseCastells(getCastellsRonda(castells, "5"));
												const pilar = parseCastells(getCastellsRonda(castells, "Pilar"));
												const sortida = parseCastells(getCastellsRonda(castells, "Sortida"));
												return (
													<>
														<tr>
															<td  style={{backgroundColor: colors_colla[colla[0]], color: GetHighContrast(colors_colla[colla[0]])}}>{colla[0]}</td>
															{ areEntrada && <td className={validClass(getCastellsRonda(castells, "Entrada"))}>{entrada}</td> }
															{ are1 && <td className={validClass(getCastellsRonda(castells, "1"))}>{round1}</td> }
															{ are2 && <td className={validClass(getCastellsRonda(castells, "2"))}>{round2}</td> }
															{ are3 && <td className={validClass(getCastellsRonda(castells, "3"))}>{round3}</td> }
															{ are4 && <td className={validClass(getCastellsRonda(castells, "4"))}>{round4}</td> }
															{ are5 && <td className={validClass(getCastellsRonda(castells, "5"))}>{round5}</td> }
															{ arePilar && <td className={validClass(getCastellsRonda(castells, "Pilar"))}>{pilar}</td> }
															{ areSortida && <td className={validClass(getCastellsRonda(castells, "Sortida"))}>{sortida}</td> }
														</tr>
													</>
												);
											})
										}
									</tbody>
								</table></div>
							</>
						);
					})
				}
			</section>
		</>);
	}
}

export default LlistaDiades;
