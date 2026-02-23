import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Building2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { normalizeRole } from "@/auth/roleRedirect";

export default function ProfilePage() {
  const { user } = useAuth();
  const role = normalizeRole(user?.role || "");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Your account information</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Name
            </div>
            <div className="font-medium">{user?.name || "-"}</div>
          </div>
          <div className="h-px bg-border" />

          <div className="flex items-center justify-between gap-4">
            <div className="text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </div>
            <div className="font-medium">{user?.email || "-"}</div>
          </div>
          <div className="h-px bg-border" />

          <div className="flex items-center justify-between gap-4">
            <div className="text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Role
            </div>
            <Badge>{role || "-"}</Badge>
          </div>
          <div className="h-px bg-border" />

          <div className="flex items-center justify-between gap-4">
            <div className="text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Business
            </div>
            <div className="font-medium">{user?.businessName || "-"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

