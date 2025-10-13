import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../context/Authcontext";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // for clickable avatar

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user info
  useEffect(() => {
    if (authUser) {
      setFullName(authUser.fullName || "");
      setBio(authUser.bio || "");
      setImagePreview(authUser.profilePicture || null);
    }
  }, [authUser]);

  // Convert file to base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profilePicture = imagePreview;
      if (selectedFile) profilePicture = await fileToBase64(selectedFile);

      const data = await updateProfile({ fullName, bio, profilePicture });

      if (data?.success) {
        // authUser is updated via AuthContext
        navigate("/"); // optional: redirect
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[70vw] h-[70vw] left-1/4 top-[-10%] rounded-full bg-[#6C63FF]/40 blur-[100px]"></div>
        <div className="absolute w-[60vw] h-[60vw] right-[-10%] bottom-[-10%] rounded-full bg-[#6C63FF]/30 blur-[120px]"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-5xl bg-[#181A2A]/80 rounded-2xl shadow-lg p-8 flex flex-row items-start gap-12 border border-gray-700">
        {/* Left form */}
        <form className="flex-1 flex flex-col gap-4" onSubmit={handleSave}>
          <h2 className="text-white text-xl font-semibold mb-2">Edit Profile</h2>

          {/* Profile picture */}
          <div className="flex flex-col items-start gap-2">
            <label className="text-white text-sm mb-1">Profile Picture</label>

            <div className="relative w-16 h-16">
              <img
                src={imagePreview || assets.defaultAvatar}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#6C63FF] cursor-pointer hover:opacity-80 transition"
                onClick={() => fileInputRef.current?.click()}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {imagePreview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-xs text-red-400 underline mt-1"
              >
                Remove Picture
              </button>
            )}
          </div>

          {/* Full name */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          {/* Bio */}
          <textarea
            placeholder="Bio"
            className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          {/* Save button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-[#a084ee] to-[#6C63FF] text-white font-semibold text-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>

        {/* Right-side live preview */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {authUser?.profilePicture ? (
            <img
              src={authUser.profilePicture}
              alt="Profile"
              className="w-48 h-48 rounded-full object-cover border-4 border-[#6C63FF] shadow-lg"
            />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
              No Profile Picture
            </div>
          )}
          <p className="mt-3 text-white font-medium">{authUser?.fullName}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
