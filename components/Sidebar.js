import { LayoutDashboard, ClipboardList, Package, MessageSquare, Tag } from "lucide-react";

const NAV_ITEMS = [
  { key: "overview", label: "Dashboard", Icon: LayoutDashboard },
  { key: "orders", label: "Orders", Icon: ClipboardList },
  { key: "inventory", label: "Inventory", Icon: Package },
  { key: "messages", label: "Messages", Icon: MessageSquare },
  { key: "discounts", label: "Discounts", Icon: Tag },
];

export default function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
      <nav className="flex-1 space-y-1 px-3 pt-8">
        {NAV_ITEMS.map(({ key, label, Icon }) => {
          const active = activeView === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              aria-current={active ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-r-md border-l-[3px] py-2.5 pr-3 pl-3.5 text-sm font-medium transition-colors ${
                active
                  ? "border-teal-600 bg-teal-50 text-teal-800"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${active ? "text-teal-600" : "text-gray-400"}`}
                strokeWidth={2}
                aria-hidden="true"
              />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-400">
        Demo store · session-scoped
      </div>
    </aside>
  );
}
