'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, MapPin, CreditCard, Heart, Package, Settings, CreditCard as Edit, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  image?: string;
}

interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
  });
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'en',
    currency: 'INR',
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account');
      return;
    }

    if (status === 'authenticated' && session?.user) {
      setProfile({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: (session.user as any).phone || '',
        image: session.user.image || '',
      });
      fetchPreferences();
    }
  }, [status, session, router]);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        await update(); // Refresh session
        setIsEditingProfile(false);
        toast({ title: 'Profile updated successfully' });
      } else {
        toast({ title: 'Failed to update profile', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        toast({ title: 'Preferences updated successfully' });
      } else {
        toast({ title: 'Failed to update preferences', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Failed to update preferences', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your profile, preferences, and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {profile.image ? (
                      <img src={profile.image} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-emerald-600" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{profile.name}</h3>
                  <p className="text-gray-600 text-sm">{profile.email}</p>
                  {session?.user.isBusinessAccount && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        B2B Account
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Link href="/orders">
                    <Button variant="ghost" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-3" />
                      My Orders
                    </Button>
                  </Link>
                  <Link href="/wishlist">
                    <Button variant="ghost" className="w-full justify-start">
                      <Heart className="w-4 h-4 mr-3" />
                      Wishlist
                    </Button>
                  </Link>
                  {session?.user.isBusinessAccount && (
                    <Link href="/b2b">
                      <Button variant="ghost" className="w-full justify-start">
                        <CreditCard className="w-4 h-4 mr-3" />
                        B2B Portal
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Profile Information</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                    >
                      {isEditingProfile ? (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!isEditingProfile}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled
                          className="mt-1 bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditingProfile}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditingProfile(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleProfileSave}
                          disabled={saving}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          {saving ? (
                            'Saving...'
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={preferences.language}
                          onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                            <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                            <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                            <SelectItem value="ar">العربية (Arabic)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={preferences.currency}
                          onValueChange={(value) => setPreferences(prev => ({ ...prev, currency: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                            <SelectItem value="QAR">QAR (ر.ق)</SelectItem>
                            <SelectItem value="AED">AED (د.إ)</SelectItem>
                            <SelectItem value="SAR">SAR (ر.س)</SelectItem>
                            <SelectItem value="OMR">OMR (ر.ع.)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <p className="text-sm text-gray-600">Receive order updates and promotions via email</p>
                          </div>
                          <Switch
                            id="email-notifications"
                            checked={preferences.notifications.email}
                            onCheckedChange={(checked) => 
                              setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, email: checked }
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sms-notifications">SMS Notifications</Label>
                            <p className="text-sm text-gray-600">Receive order updates via SMS</p>
                          </div>
                          <Switch
                            id="sms-notifications"
                            checked={preferences.notifications.sms}
                            onCheckedChange={(checked) => 
                              setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, sms: checked }
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="push-notifications">Push Notifications</Label>
                            <p className="text-sm text-gray-600">Receive notifications in your browser</p>
                          </div>
                          <Switch
                            id="push-notifications"
                            checked={preferences.notifications.push}
                            onCheckedChange={(checked) => 
                              setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, push: checked }
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handlePreferencesSave}
                        disabled={saving}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {saving ? 'Saving...' : 'Save Preferences'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Saved Addresses</CardTitle>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Add New Address
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
                      <p className="text-gray-600 mb-6">Add an address to make checkout faster</p>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Add Your First Address
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Password</h3>
                      <p className="text-gray-600 mb-4">
                        You're signed in with Google OAuth. Password management is handled by Google.
                      </p>
                      <Button variant="outline">
                        Manage Google Account
                      </Button>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                      <p className="text-gray-600 mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline" disabled>
                        Enable 2FA (Coming Soon)
                      </Button>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Account Deletion</h3>
                      <p className="text-gray-600 mb-4">
                        Permanently delete your account and all associated data
                      </p>
                      <Button variant="destructive">
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
