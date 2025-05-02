import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function page() {
  return (
    <div className="p-6 bg-background/80 rounded-lg ">
      <Card className="bg-background/80">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground ">Manage your settings here.</p>
          {/* Add more settings components here */}
        </CardContent>
      </Card>
    </div>
  );
}
