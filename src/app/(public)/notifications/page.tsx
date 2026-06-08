import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center justify-center h-20 w-20 rounded-full bg-pink-50 border-2 border-pink-100">
            <Bell className="h-9 w-9 text-pink-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Notifications</h1>
        <p className="text-slate-500 mb-8">
          Your notification center is currently under construction.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
