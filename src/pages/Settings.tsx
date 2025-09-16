import React, { useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useSettingsStore, applyThemePreference } from '@/store/useSettingsStore';
import { toast } from '@/components/ui/sonner';

export const Settings: React.FC = () => {
  const {
    profile,
    notifications,
    appearance,
    updateProfile,
    updateNotifications,
    updateAppearance,
  } = useSettingsStore();

  useEffect(() => {
    applyThemePreference(appearance.theme);
  }, [appearance.theme]);
  // Settings panels are rendered directly below

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Working Settings Panels (Security removed) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Profile Settings</CardTitle>
                <p className="text-sm text-muted-foreground">Manage your account information</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Username</Label>
              <Input 
                id="name" 
                value={profile.name} 
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Enter your username"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Username updated')}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <p className="text-sm text-muted-foreground">Email and push preferences</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch checked={notifications.emailNotifications} onCheckedChange={(v) => updateNotifications({ emailNotifications: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push notifications</p>
                <p className="text-sm text-muted-foreground">Enable in-browser push alerts</p>
              </div>
              <Switch checked={notifications.pushNotifications} onCheckedChange={(v) => updateNotifications({ pushNotifications: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly summary</p>
                <p className="text-sm text-muted-foreground">Get a weekly activity report</p>
              </div>
              <Switch checked={notifications.weeklySummary} onCheckedChange={(v) => updateNotifications({ weeklySummary: v })} />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Notification preferences saved')}>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Appearance</CardTitle>
                <p className="text-sm text-muted-foreground">Theme and density</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Theme</Label>
                <Select value={appearance.theme} onValueChange={(v) => updateAppearance({ theme: v as any })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Density</Label>
                <Select value={appearance.density} onValueChange={(v) => updateAppearance({ density: v as any })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select density" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => { applyThemePreference(appearance.theme); toast.success('Appearance updated'); }}>Apply</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};