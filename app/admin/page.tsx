"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  Mail,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  LogOut,
  Home,
  RefreshCw,
  Database,
  X,
  Check,
  AlertTriangle,
  GripVertical,
  Upload,
  FileText,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import Button from "@/components/Button";

interface Project {
  _id?: string;
  name: string;
  slug?: string;
  description: string;
  readme?: string;
  src: string;
  alt?: string;
  github?: string;
  liveLink?: string;
  screenshots?: string[];
  videos?: string[];
  tags?: string[];
  order?: number;
  createdAt?: string;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<"projects" | "messages">("projects");

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);
  const [readmeFileName, setReadmeFileName] = useState("");
  const [projectForm, setProjectForm] = useState({
    name: "",
    slug: "",
    description: "",
    readme: "",
    src: "",
    alt: "",
    github: "",
    liveLink: "",
    screenshots: "",
    videos: "",
    tags: "",
    order: 0,
  });

  // Messages state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Deletion modals state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);

  // Drag and drop reordering state
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  // UI state
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch projects
  const loadProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      }
    } catch {
      showToast("error", "Failed to load projects");
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  // Fetch messages
  const loadMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch {
      showToast("error", "Failed to load contact messages");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Auth check
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/check");
        const data = await res.json();
        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          setLoadingAuth(false);
          loadProjects();
          loadMessages();
        }
      } catch {
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, [router, loadProjects, loadMessages]);

  // Logout
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Open modal for Add
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setReadmeFileName("");
    setProjectForm({
      name: "",
      slug: "",
      description: "",
      readme: "",
      src: "",
      alt: "",
      github: "",
      liveLink: "",
      screenshots: "",
      videos: "",
      tags: "",
      order: projects.length + 1,
    });
    setProjectModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setReadmeFileName(project.readme ? "README.md" : "");
    setProjectForm({
      name: project.name,
      slug: project.slug || "",
      description: project.description,
      readme: project.readme || "",
      src: project.src,
      alt: project.alt || "",
      github: project.github || "",
      liveLink: project.liveLink || "",
      screenshots: project.screenshots ? project.screenshots.join("\n") : "",
      videos: project.videos ? project.videos.join("\n") : "",
      tags: project.tags ? project.tags.join(", ") : "",
      order: project.order ?? 0,
    });
    setProjectModalOpen(true);
  };

  // Handle Main Thumbnail Upload directly to database
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjectForm((prev) => ({
          ...prev,
          src: data.url,
          alt: prev.alt || file.name.replace(/\.[^/.]+$/, ""),
        }));
        showToast("success", "Thumbnail saved directly to database!");
      } else {
        showToast("error", data.error || "Failed to upload image");
      }
    } catch {
      showToast("error", "Error uploading image to database");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // Handle Additional Screenshots Upload directly to database
  const handleScreenshotsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingScreenshots(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.success && data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setProjectForm((prev) => {
          const current = prev.screenshots ? prev.screenshots.split("\n").filter(Boolean) : [];
          return {
            ...prev,
            screenshots: [...current, ...uploadedUrls].join("\n"),
          };
        });
        showToast("success", `${uploadedUrls.length} screenshot(s) saved to database!`);
      }
    } catch {
      showToast("error", "Failed to upload screenshots");
    } finally {
      setUploadingScreenshots(false);
      e.target.value = "";
    }
  };

  // Handle README.md file upload
  const handleReadmeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (typeof text === "string") {
        setProjectForm((prev) => ({
          ...prev,
          readme: text,
        }));
        setReadmeFileName(file.name);
        showToast("success", `Loaded ${file.name} (${text.length} chars)`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Submit project form (Add or Edit)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const isEdit = !!editingProject?._id;
      const url = isEdit ? `/api/projects/${editingProject._id}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";

      const tagsArray = projectForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const screenshotsArray = projectForm.screenshots
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const videosArray = projectForm.videos
        .split(/[\n,]/)
        .map((v) => v.trim())
        .filter(Boolean);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectForm,
          tags: tagsArray,
          screenshots: screenshotsArray,
          videos: videosArray,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast("success", isEdit ? "Project updated successfully!" : "Project created successfully!");
        setProjectModalOpen(false);
        loadProjects();
      } else {
        showToast("error", data.error || "Failed to save project");
      }
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Network error while saving");
    } finally {
      setActionLoading(false);
    }
  };

  // Persist drag and drop order
  const handlePersistOrder = async (reordered: Project[]) => {
    setIsReordering(true);
    try {
      const items = reordered.map((p, idx) => ({
        id: p._id,
        order: idx,
      }));

      const res = await fetch("/api/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast("error", data.error || "Failed to update project order");
      } else {
        showToast("success", "Projects order updated!");
      }
    } catch {
      showToast("error", "Error saving new order");
    } finally {
      setIsReordering(false);
    }
  };

  // Confirm delete project
  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete?._id) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectToDelete._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast("success", "Project deleted successfully");
        setProjectToDelete(null);
        loadProjects();
      } else {
        showToast("error", data.error || "Failed to delete project");
      }
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm delete message
  const handleConfirmDeleteMessage = async () => {
    if (!messageToDelete?._id) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/contact/${messageToDelete._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast("success", "Contact inquiry deleted");
        setMessageToDelete(null);
        loadMessages();
      } else {
        showToast("error", data.error || "Failed to delete message");
      }
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Failed to delete query");
    } finally {
      setActionLoading(false);
    }
  };



  if (loadingAuth) {
    return (
      <div data-admin className="min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="size-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
        <p className="text-sm opacity-70">Verifying admin credentials...</p>
      </div>
    );
  }

  return (
    <div data-admin className="min-h-screen flex flex-col selection:bg-brand-orange selection:text-brand-dark">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-brand-orange/20 backdrop-blur-md bg-brand-cream/80 dark:bg-brand-dark/80 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="size-10 rounded-xl p-1 bg-gradient-to-br from-brand-red/15 via-brand-orange/15 to-brand-cyan/15 border border-brand-orange/30 shadow-sm flex items-center justify-center">
              <Image src={logo} alt="AP Logo" width={36} height={36} className="object-contain brand-logo-filter" />
            </Link>
            <div>
              <span className="font-bold text-lg leading-none block">Admin Dashboard</span>
              <span className="text-xs opacity-60 flex items-center gap-1 mt-0.5">
                <Database className="size-3 text-emerald-500" />
                MongoDB Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl border border-brand-orange/20 text-brand-orange hover:bg-brand-orange/10 transition-colors text-xs font-semibold hidden sm:inline-flex items-center gap-1.5"
            >
              <Home className="size-3.5" />
              <span>Public Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl border border-brand-red/30 bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-brand-cream transition-all text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="inline-flex p-1.5 rounded-2xl border border-brand-orange/25 bg-brand-cream/60 dark:bg-brand-dark-surface/60 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "projects"
                  ? "bg-gradient-to-r from-brand-red to-brand-orange text-brand-cream shadow-md"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Briefcase className="size-4" />
              <span>Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "messages"
                  ? "bg-gradient-to-r from-brand-red to-brand-orange text-brand-cream shadow-md"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Mail className="size-4" />
              <span>Queries ({messages.length})</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {activeTab === "projects" && (
              <Button onClick={handleOpenAddModal} variant="primary" className="!py-2 !px-4 text-sm">
                <Plus className="size-4" />
                <span>Add Project</span>
              </Button>
            )}

            {activeTab === "messages" && (
              <button
                onClick={loadMessages}
                disabled={loadingMessages}
                className="px-3.5 py-2 rounded-xl border border-brand-orange/30 hover:bg-brand-orange/15 text-brand-orange transition-all text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`size-4 ${loadingMessages ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Projects List */}
        {activeTab === "projects" && (
          <div>
            {loadingProjects ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="size-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
                <p className="text-sm opacity-70">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-brand-orange/30 bg-brand-cream/30 dark:bg-brand-dark-surface/40">
                <Briefcase className="size-12 mx-auto text-brand-orange/50 mb-3" />
                <h3 className="text-lg font-bold">No Projects Found</h3>
                <p className="text-sm opacity-70 max-w-sm mx-auto mt-1 mb-6">
                  Get started by adding your first project directly through the admin panel.
                </p>
                <Button onClick={handleOpenAddModal} variant="primary">
                  <Plus className="size-4" />
                  <span>Add Project</span>
                </Button>
              </div>
            ) : (
              <div>
                {/* Drag and drop reorder hint */}
                <div className="flex items-center justify-between text-xs opacity-70 mb-4 px-1">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <GripVertical className="size-3.5 text-brand-orange" />
                    Drag and drop cards to reorder projects
                  </span>
                  {isReordering && (
                    <span className="text-brand-orange font-semibold flex items-center gap-1 animate-pulse">
                      <RefreshCw className="size-3 animate-spin" /> Saving order...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => {
                    const isBeingDragged = draggedProjectIndex === index;
                    const isDragTarget = dragOverIndex === index;

                    return (
                      <div
                        key={project._id || project.name}
                        draggable
                        onDragStart={(e) => {
                          setDraggedProjectIndex(index);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                          if (dragOverIndex !== index) {
                            setDragOverIndex(index);
                          }
                        }}
                        onDragLeave={() => {
                          if (dragOverIndex === index) {
                            setDragOverIndex(null);
                          }
                        }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          if (draggedProjectIndex === null || draggedProjectIndex === index) {
                            setDraggedProjectIndex(null);
                            setDragOverIndex(null);
                            return;
                          }
                          const updated = [...projects];
                          const [movedItem] = updated.splice(draggedProjectIndex, 1);
                          updated.splice(index, 0, movedItem);

                          const reorderedList = updated.map((item, idx) => ({
                            ...item,
                            order: idx,
                          }));

                          setProjects(reorderedList);
                          setDraggedProjectIndex(null);
                          setDragOverIndex(null);

                          await handlePersistOrder(reorderedList);
                        }}
                        onDragEnd={() => {
                          setDraggedProjectIndex(null);
                          setDragOverIndex(null);
                        }}
                        className={`rounded-2xl border bg-brand-cream/60 dark:bg-brand-dark-surface/80 backdrop-blur-sm overflow-hidden flex flex-col justify-between shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
                          isBeingDragged
                            ? "opacity-30 scale-95 border-brand-orange border-dashed"
                            : isDragTarget
                            ? "border-brand-orange ring-2 ring-brand-orange scale-[1.02] shadow-xl"
                            : "border-brand-orange/20 hover:border-brand-orange/60"
                        }`}
                      >
                        <div>
                          {/* Image Thumbnail */}
                          <div className="relative aspect-video w-full bg-brand-dark/10 dark:bg-brand-dark/40 overflow-hidden border-b border-brand-orange/15 pointer-events-none">
                            <Image
                              src={project.src}
                              alt={project.alt || project.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover object-top pointer-events-none"
                            />
                          </div>

                          <div className="p-5">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-bold text-lg line-clamp-1">{project.name}</h3>
                              <div
                                className="p-1 rounded-md text-brand-orange/60 hover:text-brand-orange hover:bg-brand-orange/10 transition-colors shrink-0"
                                title="Drag to reorder"
                              >
                                <GripVertical className="size-4" />
                              </div>
                            </div>

                        <p className="text-xs opacity-70 mt-1.5 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 pt-3 border-t border-brand-orange/15 flex items-center justify-between gap-2 bg-brand-cream/40 dark:bg-brand-dark/40">
                      <div className="flex items-center gap-2">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-brand-orange/20 hover:bg-brand-orange/10 text-brand-orange"
                            title="GitHub"
                          >
                            <GithubIcon className="size-4" />
                          </a>
                        )}
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/10"
                            title="Live Preview"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(project)}
                          className="px-3 py-1.5 rounded-lg border border-brand-orange/30 hover:bg-brand-orange/20 text-brand-orange text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="size-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setProjectToDelete(project)}
                          className="p-1.5 rounded-lg border border-brand-red/30 hover:bg-brand-red/20 text-brand-red cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    )}

        {/* Tab 2: Contact Queries */}
        {activeTab === "messages" && (
          <div>
            {loadingMessages ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="size-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
                <p className="text-sm opacity-70">Loading contact messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-brand-orange/30 bg-brand-cream/30 dark:bg-brand-dark-surface/40">
                <Mail className="size-12 mx-auto text-brand-orange/50 mb-3" />
                <h3 className="text-lg font-bold">No Inquiries Yet</h3>
                <p className="text-sm opacity-70 max-w-sm mx-auto mt-1">
                  When visitors submit inquiries through the contact form, they will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl border border-brand-orange/25 bg-brand-cream/60 dark:bg-brand-dark-surface/80 backdrop-blur-sm shadow-md flex flex-col md:flex-row md:items-start justify-between gap-6"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-bold text-base">{msg.name}</h3>
                        <a
                          href={`mailto:${msg.email}?subject=Regarding your inquiry`}
                          className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan hover:underline"
                        >
                          {msg.email}
                        </a>
                        <span className="text-xs opacity-50">
                          {new Date(msg.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>

                      <p className="text-sm opacity-85 leading-relaxed whitespace-pre-wrap bg-brand-cream/40 dark:bg-brand-dark/50 p-4 rounded-xl border border-brand-orange/15">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex md:flex-col gap-2 shrink-0">
                      <a
                        href={`mailto:${msg.email}?subject=Regarding your portfolio inquiry`}
                        className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-cyan text-brand-dark text-center hover:brightness-110 transition-all inline-flex items-center justify-center gap-1.5"
                      >
                        <Mail className="size-3.5" />
                        <span>Reply Email</span>
                      </a>

                      <button
                        onClick={() => setMessageToDelete(msg)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-brand-red/30 bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-brand-cream transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Project Add / Edit Modal */}
      <AnimatePresence>
        {projectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-brand-orange/30 bg-brand-cream dark:bg-brand-dark-surface shadow-2xl my-8 relative"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-orange/20">
                <h2 className="text-xl font-bold">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
                <button
                  onClick={() => setProjectModalOpen(false)}
                  className="p-1.5 rounded-xl text-brand-orange hover:bg-brand-orange/15 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-1">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1.5 opacity-80">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tomato Food Delivery"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-orange/30 bg-brand-cream/50 dark:bg-brand-dark/70 text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1.5 opacity-80">
                      URL Slug (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. tomato-food-delivery (auto-generated if empty)"
                      value={projectForm.slug}
                      onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-orange/30 bg-brand-cream/50 dark:bg-brand-dark/70 text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1.5 opacity-80">
                      Tags (Comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="React, Next.js, Tailwind CSS, MongoDB"
                      value={projectForm.tags}
                      onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-orange/30 bg-brand-cream/50 dark:bg-brand-dark/70 text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase mb-1.5 opacity-80">
                    Short Description (Card Summary) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Short description highlighting tech stack and features for the card..."
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-orange/30 bg-brand-cream/50 dark:bg-brand-dark/70 text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange resize-y"
                  />
                </div>

                {/* Main Thumbnail Upload */}
                <div className="p-4 rounded-2xl border border-brand-orange/20 bg-brand-cream/40 dark:bg-brand-dark/40 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase opacity-80 flex items-center gap-1.5">
                      <ImageIcon className="size-4 text-brand-orange" />
                      Main Thumbnail Image *
                    </label>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-orange/15 hover:bg-brand-orange/25 border border-brand-orange/30 text-brand-orange text-xs font-semibold transition-all">
                      <Upload className={`size-3.5 ${uploadingImage ? "animate-spin" : ""}`} />
                      <span>{uploadingImage ? "Saving to DB..." : "Upload Image to DB"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Image URL (e.g. /api/images/... or https://...)"
                        value={projectForm.src}
                        onChange={(e) => setProjectForm({ ...projectForm, src: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-brand-orange/30 bg-brand-cream/50 dark:bg-brand-dark/70 text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange font-mono text-xs"
                      />
                      <p className="text-[11px] opacity-60 mt-1">Direct database upload URL or external image link.</p>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Image Alt Text (e.g. Screenshot of dashboard)"
                        value={projectForm.alt}
                        onChange={(e) => setProjectForm({ ...projectForm, alt: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-brand-orange/30 bg-brand-cream/50 dark:bg-brand-dark/70 text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>
                  </div>

                  {projectForm.src && (
                    <div className="relative w-28 h-16 rounded-lg overflow-hidden border border-brand-orange/30 mt-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={projectForm.src}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Additional Screenshots Upload */}
                <div className="p-4 rounded-2xl border border-brand-orange/20 bg-brand-cream/40 dark:bg-brand-dark/40 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-semibold uppercase opacity-80 flex items-center gap-1.5">
                        <ImageIcon className="size-4 text-brand-orange" />
                        Additional Screenshots (Optional)
                      </label>
                      <p className="text-[11px] opacity-60">Upload multiple images stored directly in DB, or paste URLs</p>
                    </div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-orange/15 hover:bg-brand-orange/25 border border-brand-orange/30 text-brand-orange text-xs font-semibold transition-all shrink-0">
                      <Upload className={`size-3.5 ${uploadingScreenshots ? "animate-spin" : ""}`} />
                      <span>{uploadingScreenshots ? "Uploading..." : "Upload Screenshots"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleScreenshotsUpload}
                        disabled={uploadingScreenshots}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="One image URL per line (e.g. /api/images/64f... or https://...)"
                    value={projectForm.screenshots}
                    onChange={(e) => setProjectForm({ ...projectForm, screenshots: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-orange/30 bg-brand-cream/50 dark:bg-brand-dark/70 text-xs font-mono focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange resize-y"
                  />
                </div>

                {/* Videos */}
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1.5 opacity-80 flex items-center gap-1.5">
                    <Video className="size-4 text-brand-orange" />
                    Video URLs (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Direct MP4/WebM URLs, YouTube, or Vimeo links (one per line)"
                    value={projectForm.videos}
                    onChange={(e) => setProjectForm({ ...projectForm, videos: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-orange/30 bg-brand-cream/50 dark:bg-brand-dark/70 text-xs font-mono focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange resize-y"
                  />
                </div>

                {/* README Markdown Case Study */}
                <div className="p-4 rounded-2xl border border-brand-orange/20 bg-brand-cream/40 dark:bg-brand-dark/40 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-semibold uppercase opacity-80 flex items-center gap-1.5">
                        <FileText className="size-4 text-brand-orange" />
                        README / Case Study Markdown (GFM)
                      </label>
                      <p className="text-[11px] opacity-60">Upload a README.md file or edit GitHub-flavored markdown below</p>
                    </div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-orange/15 hover:bg-brand-orange/25 border border-brand-orange/30 text-brand-orange text-xs font-semibold transition-all shrink-0">
                      <Upload className="size-3.5" />
                      <span>Upload README.md</span>
                      <input
                        type="file"
                        accept=".md,.markdown,text/markdown,text/plain"
                        onChange={handleReadmeUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {readmeFileName && (
                    <div className="text-xs text-brand-orange bg-brand-orange/10 px-3 py-1.5 rounded-lg border border-brand-orange/20 flex items-center justify-between">
                      <span>Loaded from: <strong>{readmeFileName}</strong></span>
                      <span className="text-[11px] opacity-70">({projectForm.readme.length} chars)</span>
                    </div>
                  )}

                  <textarea
                    rows={6}
                    placeholder="# Project Title&#10;&#10;## Overview&#10;Write detailed case study here... Supports GitHub Flavored Markdown (tables, checklists, code blocks, bold, etc.)"
                    value={projectForm.readme}
                    onChange={(e) => setProjectForm({ ...projectForm, readme: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-orange/30 bg-brand-cream/50 dark:bg-brand-dark/70 text-xs font-mono focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange resize-y"
                  />
                </div>

                {/* Links (Both optional) */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1.5 opacity-80">
                      GitHub Repository URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/... (leave blank if private)"
                      value={projectForm.github}
                      onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-orange/30 bg-brand-cream/50 dark:bg-brand-dark/70 text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                    />
                    <span className="text-[11px] opacity-60 mt-1 block">Leave empty for private/confidential repositories.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1.5 opacity-80">
                      Live Preview URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://my-project.vercel.app"
                      value={projectForm.liveLink}
                      onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-orange/30 bg-brand-cream/50 dark:bg-brand-dark/70 text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                    />
                    <span className="text-[11px] opacity-60 mt-1 block">Leave empty if no public deployment is available.</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-brand-orange/20 mt-2">
                  <button
                    type="button"
                    onClick={() => setProjectModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-brand-orange/30 hover:bg-brand-orange/10 text-sm font-medium cursor-pointer"
                  >
                    Cancel
                  </button>

                  <Button type="submit" disabled={actionLoading || uploadingImage || uploadingScreenshots} variant="primary">
                    {actionLoading ? "Saving..." : editingProject ? "Save Changes" : "Create Project"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Project Confirmation Modal */}
      <AnimatePresence>
        {projectToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl border border-brand-red/30 bg-brand-cream dark:bg-brand-dark-surface shadow-2xl"
            >
              <div className="size-12 rounded-2xl bg-brand-red/15 text-brand-red flex items-center justify-center mb-4">
                <AlertTriangle className="size-6" />
              </div>

              <h3 className="text-xl font-bold">Delete Project?</h3>
              <p className="text-sm opacity-70 mt-1.5">
                Are you sure you want to permanently delete{" "}
                <strong className="text-brand-red">{projectToDelete.name}</strong>? This action
                cannot be undone.
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="px-4 py-2 rounded-xl border border-brand-orange/30 hover:bg-brand-orange/10 text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteProject}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-brand-red text-brand-cream hover:brightness-110 text-sm font-semibold cursor-pointer"
                >
                  {actionLoading ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Message Confirmation Modal */}
      <AnimatePresence>
        {messageToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl border border-brand-red/30 bg-brand-cream dark:bg-brand-dark-surface shadow-2xl"
            >
              <div className="size-12 rounded-2xl bg-brand-red/15 text-brand-red flex items-center justify-center mb-4">
                <AlertTriangle className="size-6" />
              </div>

              <h3 className="text-xl font-bold">Delete Inquiry?</h3>
              <p className="text-sm opacity-70 mt-1.5">
                Are you sure you want to delete the message from{" "}
                <strong className="text-brand-orange">{messageToDelete.name}</strong>?
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setMessageToDelete(null)}
                  className="px-4 py-2 rounded-xl border border-brand-orange/30 hover:bg-brand-orange/10 text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteMessage}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-brand-red text-brand-cream hover:brightness-110 text-sm font-semibold cursor-pointer"
                >
                  {actionLoading ? "Deleting..." : "Delete Inquiry"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold flex items-center gap-2.5 ${
              toast.type === "success"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-brand-red text-white border-brand-red"
            }`}
          >
            {toast.type === "success" ? <Check className="size-4" /> : <AlertTriangle className="size-4" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
