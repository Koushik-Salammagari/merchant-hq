export default function Panel({ title, subtitle, children }) {
  return (
    <section className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-3">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex-1 divide-y divide-gray-100">{children}</div>
    </section>
  );
}
