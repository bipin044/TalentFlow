import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';
export type DensityPreference = 'comfortable' | 'compact';

export interface ProfileSettings {
  name: string;
  avatarUrl?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklySummary: boolean;
}

export interface AppearanceSettings {
  theme: ThemePreference;
  density: DensityPreference;
}

interface SettingsState {
  profile: ProfileSettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  updateProfile: (updates: Partial<ProfileSettings>) => void;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;
  updateAppearance: (updates: Partial<AppearanceSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      profile: {
        name: 'User',
        avatarUrl: '',
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        weeklySummary: true,
      },
      appearance: {
        theme: 'system',
        density: 'comfortable',
      },
      updateProfile: (updates) => set((state) => ({ profile: { ...state.profile, ...updates } })),
      updateNotifications: (updates) => set((state) => ({ notifications: { ...state.notifications, ...updates } })),
      updateAppearance: (updates) => set((state) => ({ appearance: { ...state.appearance, ...updates } })),
    }),
    {
      name: 'app-settings',
      partialize: (state) => ({
        profile: state.profile,
        notifications: state.notifications,
        appearance: state.appearance,
      }),
    }
  )
);

// Utility to apply theme immediately when appearance changes
export const applyThemePreference = (theme: ThemePreference) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = theme === 'dark' || (theme === 'system' && isSystemDark);
  root.classList.toggle('dark', shouldUseDark);
};


