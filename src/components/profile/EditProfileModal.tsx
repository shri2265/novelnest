import { useRef, useState } from "react";
import { Camera, Trash2, Upload } from "lucide-react";
import { useNest } from "../../store/NestContext";
import { Modal } from "../ui/Modal";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { toast } from "../../lib/toast";
import { fileToAvatarDataUrl, ImageError, isSupportedImageFile } from "../../lib/image";

const BIO_LIMIT = 300;
const USERNAME_PATTERN = /^[a-zA-Z0-9_.]{3,30}$/;

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const { user, updateUser } = useNest();
  const fileRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);
  const [location, setLocation] = useState(user.location);
  const [bio, setBio] = useState(user.bio);
  const [avatarImage, setAvatarImage] = useState<string | undefined>(user.avatarImage);
  const [errors, setErrors] = useState<{ displayName?: string; username?: string }>({});
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!isSupportedImageFile(file)) {
      toast("That file isn't a JPG, PNG or WebP image.");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setAvatarImage(dataUrl);
      toast("Looking lovely — remember to save.");
    } catch (err) {
      toast(err instanceof ImageError ? err.message : "We couldn't process that image.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSave = () => {
    const nextErrors: { displayName?: string; username?: string } = {};
    if (!displayName.trim()) nextErrors.displayName = "A display name is required.";
    if (!USERNAME_PATTERN.test(username.trim()))
      nextErrors.username = "3–30 letters, numbers, dots or underscores.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    updateUser({
      displayName: displayName.trim(),
      username: username.trim().toLowerCase(),
      handle: `@${username.trim().toLowerCase().replace(/^@/, "")}`,
      location: location.trim(),
      bio: bio.trim(),
      avatarImage,
    });
    toast("Profile saved. The shelf knows you a little better.");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit profile"
      description="Your name, your picture, and the words under it."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={busy}>
            Save changes
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee/40 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
            aria-label="Change profile picture"
            disabled={busy}
          >
            <Avatar label={user.avatar} src={avatarImage} size="xl" alt={displayName || user.displayName} className="ring-4 ring-parchment/60" />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-espresso/45 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <Camera className="h-6 w-6 text-cream" />
            </span>
          </button>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button size="sm" variant="secondary" icon={Upload} onClick={() => fileRef.current?.click()} disabled={busy}>
              {avatarImage ? "Replace" : "Upload"}
            </Button>
            {avatarImage ? (
              <Button size="sm" variant="ghost" icon={Trash2} onClick={() => { setAvatarImage(undefined); toast("Picture removed — initials it is."); }} disabled={busy}>
                Remove
              </Button>
            ) : null}
          </div>
          <p className="max-w-[12rem] text-center text-[11px] leading-relaxed text-espresso/45">
            JPG, PNG or WebP. The picture is cropped into a circle for you.
          </p>
        </div>

        <div className="w-full space-y-4">
          <label className="block text-sm font-semibold text-espresso">
            Display name
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={60}
              className="mt-1.5 w-full rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20"
              aria-invalid={Boolean(errors.displayName)}
            />
            {errors.displayName ? <span className="mt-1 block text-xs text-terracotta-deep">{errors.displayName}</span> : null}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-espresso">
              Username
              <span className="relative mt-1.5 flex items-center">
                <span className="pointer-events-none absolute left-3 text-sm text-espresso/40">@</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={30}
                  className="w-full rounded-xl border border-parchment-deep/60 bg-cream/70 py-2.5 pl-7 pr-3.5 text-sm text-espresso focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20"
                  aria-invalid={Boolean(errors.username)}
                />
              </span>
              {errors.username ? <span className="mt-1 block text-xs text-terracotta-deep">{errors.username}</span> : null}
            </label>

            <label className="block text-sm font-semibold text-espresso">
              Location
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={60}
                placeholder="Somewhere between chapters"
                className="mt-1.5 w-full rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/35 focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20"
              />
            </label>
          </div>

          <label className="block text-sm font-semibold text-espresso">
            Caption
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, BIO_LIMIT))}
              rows={4}
              maxLength={BIO_LIMIT}
              placeholder="Write something about yourself…"
              className="mt-1.5 w-full resize-none rounded-xl border border-parchment-deep/60 bg-cream/70 px-3.5 py-2.5 text-sm leading-relaxed text-espresso placeholder:text-espresso/35 focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20"
            />
            <span className={`mt-1 block text-right text-[11px] tabular-nums ${bio.length > BIO_LIMIT - 20 ? "text-terracotta-deep" : "text-espresso/45"}`}>
              {bio.length}/{BIO_LIMIT}
            </span>
          </label>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </Modal>
  );
}
