import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Settings: React.FC = () => {
  const settingsCategories = [
    {
      title: 'Profile Settings',
      description: 'Manage your account information and preferences',
      icon: User,
      color: 'bg-primary',
    },
    {
      title: 'Notifications',
      description: 'Configure email and push notification preferences',
      icon: Bell,
      color: 'bg-warning',
    },
    {
      title: 'Security',
      description: 'Password, two-factor authentication, and security settings',
      icon: Shield,
      color: 'bg-success',
    },
    {
      title: 'Appearance',
      description: 'Theme, layout, and display preferences',
      icon: Palette,
      color: 'bg-secondary',
    },
  ];

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

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCategories.map((category, index) => (
          <Card 
            key={index}
            className="card-elevated hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.title}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                {category.description}
              </p>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <SettingsIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Settings Configuration</h3>
        <p className="text-muted-foreground mb-4">
          Detailed settings panels and configuration options coming soon
        </p>
      </div>
    </div>
  );
};