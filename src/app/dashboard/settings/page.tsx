"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Moon, Sun, Monitor } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Appearance Settings</CardTitle>
        <CardDescription>
          Customize the look and feel of your workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <h3 className="text-base font-medium">Theme</h3>
            <p className="text-sm text-muted-foreground">
              Select the theme for the dashboard.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="icon"
              onClick={() => setTheme("light")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Light</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="icon"
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Dark</span>
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="icon"
              onClick={() => setTheme("system")}
            >
              <Monitor className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">System</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
