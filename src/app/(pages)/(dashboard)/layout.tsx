import Sidebar from '@/components/sideBar/SideBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
        </div>
    );
}
