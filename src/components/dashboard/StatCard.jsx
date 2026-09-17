export default function StatCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
  description,
}) {
  return (
    <article className="stat-card">
      <div className={`stat-card__icon stat-card__icon--${color}`}>
        <Icon size={22} />
      </div>

      <div className="stat-card__content">
        <p className="stat-card__title">{title}</p>
        <h3 className="stat-card__value">{value}</h3>
        <p className="stat-card__description">{description}</p>
      </div>
    </article>
  );
}