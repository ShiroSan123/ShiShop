import { LogoutButton } from "@/components/admin/LogoutButton";

export const AdminTopbar = ({ username }: { username: string }) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
      <div>
        <div className="text-sm text-slate-500">Вошли как</div>
        <div className="text-base font-semibold text-slate-900">
          {username}
        </div>
      </div>
      <LogoutButton />
    </div>
  );
};
