export const Bandera = ({ country }) => {
  const flagUrl =
    country.flag_url || `https://flagcdn.com/w640/${country.iso_code.toLowerCase()}.png`;

  return (
    <aside className="vexillo-plate" aria-label={`Bandera de ${country.name}`}>
      <div className="vexillo-plate__header">
        <span>{country.region.toUpperCase()}</span>
        <span>Bandera nacional</span>
      </div>
      <div className="vexillo-plate__flag-frame">
        <img src={flagUrl} alt={`Pabellón oficial de ${country.name}`} />
      </div>
      <div className="vexillo-plate__footer">
        <h2>{country.name}</h2>
        <span>{country.region.toUpperCase()}</span>
      </div>
    </aside>
  );
};
