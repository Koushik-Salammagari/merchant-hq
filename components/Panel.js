export default function Panel({ title, subtitle, children }) {
  return (
    <section className="flex flex-col rounded-xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
      </div>
      <div className="flex-1 divide-y divide-gray-100">{children}</div>
    </section>
  );
}
