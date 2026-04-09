"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { userService } from "@/services/userService";
import { UserProfileUpdateRequest, ProfileResponse } from "@/types";
import { useTranslation } from "@/context/LanguageContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { toast } from "react-hot-toast"; 

export default function EditProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<UserProfileUpdateRequest>({
    firstName: "",
    lastName: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Mevcut verileri çekip formu doldur
  useEffect(() => {
    const fetchCurrentData = async () => {
      const res = await userService.getUserProfile(username as string, "en");
      if (res.success) {
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          bio: res.data.bio || "",
        });
      }
      setLoading(false);
    };
    fetchCurrentData();
  }, [username]);

  // 2. Kaydetme İşlemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userService.updateProfile(username as string, formData);
      if (res.success) {
        toast.success(t("profile.updateSuccess"));
        router.push(`/profile/${username}`); // İşlem bitince profile geri dön
      }
    } catch (err) {
      console.error("Update error", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl font-bold mb-8">{t("profile.editProfile")}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
          <input
            type="text"
            className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 focus:ring-yellow-500 focus:border-yellow-500"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
          <input
            type="text"
            className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
          <textarea
            rows={4}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5"
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            maxLength={250}
          />
          <p className="text-xs text-gray-500 mt-1">{formData.bio?.length}/250</p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-transform active:scale-95"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}