import WebMcpStatusPill from "./WebMcpStatusPill";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-gray-900">Merchant HQ</h1>
          <p className="text-sm text-gray-500">An agent co-pilot for your store&rsquo;s back office</p>
        </div>
        <WebMcpStatusPill />
      </div>
    </header>
  );
}
