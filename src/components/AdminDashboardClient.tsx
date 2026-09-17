'use client'

import { useState } from 'react'
import { Users, BookOpen, Calendar, Shield, Settings, LogOut, ArrowLeft, LayoutDashboard, Activity, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { AddBookForm, StatusSelect, RoleSelect, AddEventForm, DeleteEventButton, AttendanceCheckbox, ClubSettingsForm, AddMerchForm, DeleteMerchButton, DeleteBookButton } from '@/app/BWRF-admin/AdminForms'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts'

export default function AdminDashboardClient({ 
  profiles, 
  books, 
  events,
  rsvps,
  settings,
  merchandise
}: { 
  profiles: any[], 
  books: any[], 
  events: any[],
  rsvps: any[],
  settings?: any,
  merchandise: any[]
}) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'library', label: 'Library & Voting', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'moderation', label: 'Moderation', icon: Shield },
    { id: 'merchandise', label: 'Merchandise', icon: ShoppingBag },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-light">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 md:min-h-screen">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <span className="text-xl tracking-tight font-medium text-slate-900">{settings?.club_name || "BRWF"}</span>
          </Link>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <h4 className="px-3 mb-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
            Admin Portal
          </h4>
          <div className="flex flex-col gap-1">
            {tabs.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-slate-900 text-white' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" /> 
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <Link href="/BWRF-member" className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Back to Club</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto max-h-screen">
        <div className="max-w-5xl mx-auto">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8">
                <h1 className="text-3xl font-thin text-slate-900 mb-2">Club Overview</h1>
                <p className="text-slate-500">High-level metrics and health of the community.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-light text-slate-900 mb-1">{profiles.length}</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Members</div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-light text-slate-900 mb-1">{books.length}</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Books in Library</div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-light text-slate-900 mb-1">{events.length}</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Events</div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-light text-slate-900 mb-1">{rsvps.length}</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total RSVPs</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-sm font-medium text-slate-900 mb-4">Membership Role Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Owners/Admins', value: profiles.filter(p => p.role === 'owner' || p.role === 'admin').length, color: '#3b82f6' },
                            { name: 'Full Members', value: profiles.filter(p => p.role === 'member').length, color: '#10b981' },
                            { name: 'Guests (Prospects)', value: profiles.filter(p => p.role === 'guest' || !p.role).length, color: '#f59e0b' },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {
                            [
                              { name: 'Owners/Admins', value: profiles.filter(p => p.role === 'owner' || p.role === 'admin').length, color: '#3b82f6' },
                              { name: 'Full Members', value: profiles.filter(p => p.role === 'member').length, color: '#10b981' },
                              { name: 'Guests (Prospects)', value: profiles.filter(p => p.role === 'guest' || !p.role).length, color: '#f59e0b' },
                            ].map((entry, index) => (
                              <Cell key={'cell-' + index} fill={entry.color} />
                            ))
                          }
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-xs font-light"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Admins</div>
                    <div className="flex items-center gap-2 text-xs font-light"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>Members</div>
                    <div className="flex items-center gap-2 text-xs font-light"><div className="w-3 h-3 rounded-full bg-amber-500"></div>Guests</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-sm font-medium text-slate-900 mb-4">Event Attendance Funnel</h3>
                  <p className="text-xs text-slate-500 font-light mb-6">Tracking RSVPs vs. Marked Attendance</p>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={events.map(e => {
                        const evtRsvps = rsvps?.filter(r => r.event_id === e.id) || []
                        return {
                          name: new Date(e.date_time).toLocaleDateString([], {month:'short', day:'numeric'}),
                          RSVPs: evtRsvps.length,
                          Attended: evtRsvps.filter(r => r.attended).length
                        }
                      }).slice(-5)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                        <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                        <Bar dataKey="RSVPs" fill="#cbd5e1" radius={[4,4,0,0]} />
                        <Bar dataKey="Attended" fill="#0f172a" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8">
                <h1 className="text-3xl font-thin text-slate-900 mb-2">Member Directory</h1>
                <p className="text-slate-500">Manage user roles, access, and accounts.</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Member</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {profiles.map(profile => (
                      <tr key={profile.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-medium">
                              {profile.display_name?.charAt(0) || 'U'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">{profile.display_name || 'Anonymous User'}</div>
                              <div className="text-xs text-slate-400">{profile.id.substring(0,8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {new Date(profile.created_at || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RoleSelect userId={profile.id} currentRole={profile.role} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Library Tab */}
          {activeTab === 'library' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8">
                <h1 className="text-3xl font-thin text-slate-900 mb-2">Library & Voting</h1>
                <p className="text-slate-500">Manage the book catalog and active voting sessions.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <h2 className="text-xl font-light text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-slate-400" />
                    Add New Book
                  </h2>
                  <AddBookForm />
                </div>
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-light text-slate-900 mb-4">Manage Library</h2>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Book</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Author</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {books?.map((book) => (
                          <tr key={book.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-7 bg-slate-100 rounded overflow-hidden">
                                  {book.cover_image_url && <img src={book.cover_image_url} alt="" className="h-full w-full object-cover" />}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-slate-900">{book.title}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{book.author}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusSelect bookId={book.id} currentStatus={book.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <DeleteBookButton bookId={book.id} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8">
                <h1 className="text-3xl font-thin text-slate-900 mb-2">Event Management</h1>
                <p className="text-slate-500">Schedule meetings, monitor RSVPs, and trigger live mode.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <h2 className="text-xl font-light text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    Schedule Event
                  </h2>
                  <AddEventForm books={books} />
                </div>
                
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-light text-slate-900 mb-4">Upcoming Meetings</h2>
                  <div className="space-y-4">
                    {events.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-light">No events scheduled.</p>
                      </div>
                    ) : (
                      events.map(event => {
                        const eventRsvps = rsvps?.filter(r => r.event_id === event.id) || [];
                        return (
                          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row gap-6 items-center">
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center min-w-[80px]">
                              <div className="text-xs font-medium text-slate-500 uppercase">
                                {new Date(event.date_time).toLocaleString('default', { month: 'short' })}
                              </div>
                              <div className="text-2xl font-light text-slate-900">
                                {new Date(event.date_time).getDate()}
                              </div>
                            </div>
                            
                            <div className="flex-1 text-center sm:text-left w-full">
                              <h3 className="text-lg font-medium text-slate-900">{event.title}</h3>
                              <p className="text-sm text-slate-500 font-light mb-2">{event.description}</p>
                              <div className="flex items-center gap-4 text-xs font-light text-slate-400 justify-center sm:justify-start">
                                <span>{new Date(event.date_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                {event.book_id && (
                                  <>
                                    <span>&bull;</span>
                                    <span>Book ID: {event.book_id.substring(0,8)}...</span>
                                  </>
                                )}
                              </div>
                              
                              <div className="mt-4 bg-slate-50 rounded-lg p-3 border border-slate-100 text-left">
                                <h4 className="text-xs font-medium text-slate-900 mb-2 flex items-center gap-2">
                                  <Users className="w-3 h-3 text-slate-500" /> 
                                  {eventRsvps.length} RSVPs
                                </h4>
                                {eventRsvps.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                                                      {eventRsvps.map((rsvp: any) => (
                                    <div key={rsvp.id} className="flex flex-col gap-1 bg-white border border-slate-200 px-3 py-2 rounded-md">
                                      <span className="text-xs text-slate-700 font-medium">{rsvp.profiles?.display_name || 'Anonymous'}</span>
                                      <AttendanceCheckbox rsvpId={rsvp.id} initialAttended={rsvp.attended} />
                                    </div>
                                  ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400 font-light">No one has RSVP'd yet.</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 shrink-0">
                              <DeleteEventButton eventId={event.id} />
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

            {/* Merchandise Tab */}
            {activeTab === 'merchandise' && (
              <div className="animate-in fade-in duration-500">
                <div className="mb-8">
                  <h1 className="text-3xl font-thin text-slate-900 mb-2">Merchandise Store</h1>
                  <p className="text-slate-500">Manage products, pricing, and images for the club store.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <h2 className="text-xl font-light text-slate-900 mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-slate-400" />
                      Add Product
                    </h2>
                    <AddMerchForm />
                  </div>
                  
                  <div className="lg:col-span-2">
                    <h2 className="text-xl font-light text-slate-900 mb-4">Inventory</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {merchandise?.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500 font-light">No products in the store yet.</td>
                            </tr>
                          ) : (
                            merchandise?.map(item => (
                              <tr key={item.id}>
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <img src={item.image_url} alt={item.name} className="h-10 w-10 rounded object-cover border border-slate-200" />
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-slate-900">{item.name}</div>
                                      <div className="text-xs text-slate-500 truncate max-w-xs">{item.description}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                  ₦{item.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <DeleteMerchButton merchId={item.id} />
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-500 max-w-xl">
              <div className="mb-8">
                <h1 className="text-3xl font-thin text-slate-900 mb-2">Club Configuration</h1>
                <p className="text-slate-500">Global settings that affect the entire application.</p>
              </div>
              <ClubSettingsForm settings={settings} />
            </div>
          )}

          {/* Moderation Tab */}
          {activeTab === 'moderation' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8">
                <h1 className="text-3xl font-thin text-slate-900 mb-2">Moderation</h1>
                <p className="text-slate-500">Manage guests, suspended users, and club access.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                {/* Pending Guests */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                    <h3 className="text-sm font-medium text-slate-900">Pending Guests</h3>
                    <p className="text-xs text-slate-500 mt-1">Users who joined but have not yet attended 2 events.</p>
                  </div>
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Guest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {profiles.filter(p => p.role === 'guest' || !p.role).length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500 font-light">No pending guests.</td>
                        </tr>
                      ) : (
                        profiles.filter(p => p.role === 'guest' || !p.role).map(profile => (
                          <tr key={profile.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 font-medium">
                                  {profile.display_name?.charAt(0) || 'U'}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-slate-900">{profile.display_name || 'Anonymous User'}</div>
                                  <div className="text-xs text-slate-400">{profile.id.substring(0,8)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {new Date(profile.created_at || Date.now()).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <RoleSelect userId={profile.id} currentRole={profile.role} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Suspended Users */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                    <h3 className="text-sm font-medium text-slate-900">Suspended Users</h3>
                    <p className="text-xs text-slate-500 mt-1">Users whose access to the club has been temporarily or permanently revoked.</p>
                  </div>
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {profiles.filter(p => p.role === 'suspended').length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500 font-light">No suspended users.</td>
                        </tr>
                      ) : (
                        profiles.filter(p => p.role === 'suspended').map(profile => (
                          <tr key={profile.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-red-50 rounded-full flex items-center justify-center text-red-600 font-medium">
                                  {profile.display_name?.charAt(0) || 'U'}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-slate-900">{profile.display_name || 'Anonymous User'}</div>
                                  <div className="text-xs text-slate-400">{profile.id.substring(0,8)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {new Date(profile.created_at || Date.now()).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <RoleSelect userId={profile.id} currentRole={profile.role} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}


