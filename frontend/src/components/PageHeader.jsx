import { Button } from "@/components/ui/button";

export default function PageHeader({ title, description, action }) {
  return (
    <div className="flex items-center justify-between mb-6 animate-slide-down">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {title}
        </h1>
        {description && <p className="text-lg text-muted-foreground mt-2 animate-fade-in">{description}</p>}
      </div>
      {action && <div className="animate-scale-in">{action}</div>}
    </div>
  );
}
