import { useState, useEffect } from "react";
function LeagueApp() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("leagueData");
    if (saved) setTeams(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("leagueData", JSON.stringify(teams));
  }, [teams]);

  const addTeam = () => {
    if (!teamName.trim()) return;
    if (teams.find((t) => t.name === teamName)) return;
    setTeams([...teams, { name: teamName, played: 0, wins: 0, losses: 0, points: 0 }]);
    setTeamName("");
  };

  const recordMatch = () => {
    if (!teamA || !teamB || teamA === teamB || !result) return;
    const updated = teams.map((t) => ({ ...t }));
    const A = updated.find((t) => t.name === teamA);
    const B = updated.find((t) => t.name === teamB);
    if (!A || !B) return;

    if (result === "A") {
      A.wins++; A.points++; A.played++;
      B.losses++; B.played++;
    } else if (result === "B") {
      B.wins++; B.points++; B.played++;
      A.losses++; A.played++;
    } else if (result === "D") {
      A.played++; B.played++;
    }
    setTeams(updated);
    setResult("");
  };

  const resetLeague = () => {
    if (confirm("Tüm veriler silinecek. Emin misin?")) {
      localStorage.removeItem("leagueData");
      setTeams([]);
    }
  };

  const standings = [...teams].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

  return (
    <div style={{ padding: '1rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Takım Ekle</h2>
      <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Takım adı" />
      <button onClick={addTeam}>Ekle</button>
      <hr/>
      <h2>Maç Kaydet</h2>
      <input value={teamA} onChange={(e) => setTeamA(e.target.value)} placeholder="Takım A" />
      <input value={teamB} onChange={(e) => setTeamB(e.target.value)} placeholder="Takım B" />
      <div>
        <button onClick={() => setResult("A")}>A Kazandı</button>
        <button onClick={() => setResult("B")}>B Kazandı</button>
        <button onClick={() => setResult("D")}>Berabere</button>
      </div>
      <button onClick={recordMatch}>Kaydet</button>
      <hr/>
      <h2>Lig Tablosu</h2>
      <table border="1" width="100%">
        <thead><tr><th>Takım</th><th>O</th><th>G</th><th>M</th><th>P</th><th>%</th></tr></thead>
        <tbody>
          {standings.map((t, i) => (
            <tr key={i}>
              <td>{t.name}</td>
              <td>{t.played}</td>
              <td>{t.wins}</td>
              <td>{t.losses}</td>
              <td>{t.points}</td>
              <td>{t.played ? ((t.wins / t.played) * 100).toFixed(1) : 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={resetLeague}>Sıfırla</button>
    </div>
  );
}
export default LeagueApp;
