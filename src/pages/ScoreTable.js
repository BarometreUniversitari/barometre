import { Component } from "react";

class ScoreTable extends Component {
	render() {
		const { puntuacions } = this.props;

		const groupInedit = group => {
			return !taula_puntuacions
				.filter(castell => castell["Grup"] === group)
				.map(castell => castell["Mai carregat"])
				.reduce((prev, curr) => prev || curr, false);
		};

		const subGroupInedit = (group, subgroup) => {
			return !taula_puntuacions
				.filter(castell => castell["Grup"] === group && castell["Subgrup"] === subgroup)
				.map(castell => castell["Mai carregat"])
				.reduce((prev, curr) => prev || curr, false);
		};

		const groupLength = (group) => {
			let length = 0;
			taula_puntuacions.forEach((castell, i) => {
				if (castell["Grup"] === group) length += 1;
			});
			return length;
		};

		const subGroupLength = (group, subgroup) => {
			let length = 0;
			taula_puntuacions.forEach((castell, i) => {
				if (castell["Grup"] === group && castell["Subgrup"] === subgroup) length += 1;
			});
			return length;
		};

		const taula_puntuacions = [...Object.values(puntuacions)];

		let lastGroup = -1;
		let lastSub = -1;
		return (<>
			<section>
				<h2 style={{marginBottom: '1rem'}}>Taula de puntuacions</h2>

				<p>
					Aquesta taula serà actualitzada contínuament per tal de garantir el major consens possible.
				</p>
				<p>
					Per col·laborar-hi afegeix un comentari en aquest <a href="https://docs.google.com/spreadsheets/d/105YLYfRNPUvhx6G8QUkZykGPHPTpzCk6WO5zBGV2LcA#gid=439551992" rel="noreferrer" target="_blank">Excel</a>.
				</p>

				<table className="score-tb">
					<thead>
						<tr>
							<th>Grup</th>
							<th>Subgrup</th>
							<th>Castell</th>
							<th>Carregat</th>
							<th>Descarregat</th>
						</tr>
					</thead>
					<tbody>
					{
						taula_puntuacions.map((castell, i) => {
							const group = lastGroup === castell["Grup"] ? <></> : <td className={groupInedit(castell["Grup"]) ? 'inedit' : ''} rowSpan={groupLength(castell["Grup"])}>Grup {castell["Grup"]}</td>;
							const sub = lastSub === castell["Subgrup"] && lastGroup === castell["Grup"] ? <></> : <td className={subGroupInedit(castell["Grup"], castell["Subgrup"]) ? 'inedit' : ''} rowSpan={subGroupLength(castell["Grup"], castell["Subgrup"])}>sub {castell["Subgrup"]}</td>;
							lastGroup = castell["Grup"];
							lastSub = castell["Subgrup"];
							return (
								<>
									<tr className={"grup"+lastGroup}>
										{group}
										{sub}
										{
											<>
												<td className={!castell["Mai carregat"] ? 'inedit': ''}>{Object.keys(puntuacions)[i]}</td>
												<td className={!castell["Mai carregat"] ? 'inedit': ''}>{castell["Carregat"]}</td>
												<td className={!castell["Mai descarregat"] ? 'inedit': ''}>{castell["Descarregat"]}</td>							
											</>
										}
									</tr>
								</>
							);
						})
					}
					</tbody>
				</table>
			</section>
		</>);
	}
}

export default ScoreTable;
