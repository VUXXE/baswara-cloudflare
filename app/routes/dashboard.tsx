import { useState, useEffect } from 'react';
import { createFileRoute, Link, redirect, useNavigate, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { Plus, Settings, Users, LayoutDashboard as DashboardIcon, LogOut, Share2, Download, X, Eye, Settings2, Trash2 } from 'lucide-react';

import { fetchRsvps, deleteProject } from '../lib/serverFns';
import { authClient } from '../lib/auth-client';
import { invitations } from '../lib/schema';
import { eq, desc } from 'drizzle-orm';

const fetchDashboardData = createServerFn({ method: 'GET' })
  .handler(async () => {
    const [{ getSessionUser }, { getDb }] = await Promise.all([
      import('../lib/auth'),
      import('../lib/db'),
    ]);
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      throw redirect({ to: '/login' });
    }

    const db = getDb();
    const list = await db
      .select()
      .from(invitations)
      .where(eq(invitations.userId, sessionUser.userId))
      .orderBy(desc(invitations.createdAt));

    return list || [];
  });

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' });
  },
  loader: async () => await fetchDashboardData(),
  component: DashboardPage,
});

function DashboardPage() {
  const invitations = Route.useLoaderData();
  const navigate = useNavigate();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    navigate({ to: '/login' });
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject({ data: id });
        router.invalidate();
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-8 flex items-center gap-2">
          <img src="/baswara-logo.svg" alt="Baswara" className="h-6" />
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium transition-colors">
            <DashboardIcon className="w-5 h-5" />
            My Projects
          </Link>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors">
            <Users className="w-5 h-5" />
            Account
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors mt-auto">
            <Settings className="w-5 h-5" />
            Settings
          </a>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl font-medium transition-colors w-full text-left">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Invitations</h1>
            <p className="text-gray-500 mt-1">Manage your wedding projects and track RSVPs.</p>
          </div>
          <Link to="/onboarding" className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:bg-primary/90 transition-all hover:-translate-y-0.5">
            <Plus className="w-5 h-5" />
            New Project
          </Link>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-400">
              You haven't created any projects yet.
            </div>
          ) : (
            invitations.map((inv: any) => {
              // Parse the JSON data safely
              const data = typeof inv.data === 'string' ? JSON.parse(inv.data) : inv.data;
              const { groomName, brideName, coverPhoto } = data as any;
              
              return (
                <div key={inv.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  <div className="h-40 bg-gray-100 relative overflow-hidden shrink-0">
                    {coverPhoto && coverPhoto !== '/cover.png' ? (
                      <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <>
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display-romantic text-4xl text-gray-400">{groomName?.[0]} &amp; {brideName?.[0]}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{groomName} &amp; {brideName}</h3>
                        <a href={`/${inv.slug}`} target="_blank" className="text-sm text-primary hover:underline">{import.meta.env.VITE_APP_DOMAIN || 'localhost:3000'}/{inv.slug}</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">Published</span>
                        <button 
                          onClick={() => handleDeleteProject(inv.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-auto pt-6 border-t border-gray-100">
                      <Link
                        to="/dashboard/$projectId"
                        params={{ projectId: inv.id }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FD5E4B] hover:bg-[#E54835] text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
                      >
                        <Settings2 className="w-4 h-4" /> Manage Event
                      </Link>
                      
                      <div className="flex gap-2">
                        <Link
                          to="/builder"
                          search={{ projectId: inv.id }}
                          className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-lg transition-colors border border-gray-200"
                        >
                          Design
                        </Link>
                        <a
                          href={`/${inv.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-lg transition-colors border border-gray-200"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
