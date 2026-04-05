"use client";

import { useState, useEffect } from "react";
import { getPendingUsers, approveUser, rejectUser } from "@/actions/auth";
import { getPaymentQueue, verifyPaymentAndPublish } from "@/actions/ads";
import { getSystemLogs } from "@/actions/logs";

export default function AdminDashboard() {
  const [queue, setQueue] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"PAYMENTS" | "APPROVALS" | "LOGS">("APPROVALS");

  useEffect(() => {
    // Fetch real pending users from Supabase Prisma API
    getPendingUsers().then((res) => {
       if (res.users) setPendingUsers(res.users);
    });
    getPaymentQueue().then((ads) => {
       setQueue(ads as any[]);
    });
    getSystemLogs().then((logData) => {
       setLogs(logData as any[]);
    });
  }, []);

  const handleVerify = async (id: string, decision: "VERIFY" | "REJECT") => {
    if (decision === "VERIFY") {
       await verifyPaymentAndPublish(id);
       alert(`Successfully PUBLISHED Campaign ${id}.`);
    }
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUserApproval = async (userId: string, decision: "APPROVE" | "REJECT") => {
    if (decision === "APPROVE") {
       await approveUser(userId);
    } else {
       await rejectUser(userId);
    }
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <div className="w-full h-full pb-20">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-zinc-400">Manage payment verifications and platform access.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="bg-zinc-900 border border-white/10 p-1 flex rounded-lg">
           <button 
             onClick={() => setActiveTab("APPROVALS")}
             className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === "APPROVALS" ? "bg-indigo-600 text-white shadow" : "text-zinc-500 hover:text-white"}`}
           >
             User Approvals ({pendingUsers.length})
           </button>
           <button 
             onClick={() => setActiveTab("PAYMENTS")}
             className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === "PAYMENTS" ? "bg-indigo-600 text-white shadow" : "text-zinc-500 hover:text-white"}`}
           >
             Payment Verifications
           </button>
           <button 
             onClick={() => setActiveTab("LOGS")}
             className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === "LOGS" ? "bg-indigo-600 text-white shadow" : "text-zinc-500 hover:text-white"}`}
           >
             System Logs
           </button>
        </div>
      </div>

      {activeTab === "APPROVALS" && (
        <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl mb-10">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-950/50">
            <div>
               <h2 className="text-xl font-bold">Pending Account Requests</h2>
               <p className="text-xs text-zinc-500 mt-1">These users are walled off by NextAuth until approved.</p>
            </div>
            <span className="bg-indigo-500/20 text-indigo-400 text-xs px-3 py-1 font-mono rounded-full border border-indigo-500/30">
              {pendingUsers.length} Pending
            </span>
          </div>
          
          {pendingUsers.length === 0 ? (
            <div className="p-10 text-center text-zinc-500 flex flex-col items-center">
              <p className="font-medium text-lg text-white">No Pending Sign-Ups!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-zinc-500 bg-zinc-900 border-b border-white/5 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">Applicant Name & Email</th>
                    <th className="px-6 py-4 font-medium">Requested Role</th>
                    <th className="px-6 py-4 font-medium">Registration Date</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 text-white">
                         <div className="font-bold">{user.name}</div>
                         <div className="text-xs text-zinc-400">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="font-mono text-xs bg-zinc-800 px-2 py-1 rounded">{user.role}</span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                         {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                             onClick={() => handleUserApproval(user.id, "APPROVE")}
                             className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors"
                          >
                             Approve Access
                          </button>
                          <button 
                             onClick={() => handleUserApproval(user.id, "REJECT")}
                             className="px-3 py-1.5 bg-red-900/50 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 rounded text-xs font-bold transition-colors"
                          >
                             Block
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "PAYMENTS" && (
        <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-950/50">
            <div>
               <h2 className="text-xl font-bold">Awaiting Payment Verification</h2>
               <p className="text-xs text-zinc-500 mt-1">Cross-reference incoming wire transfers before publishing.</p>
            </div>
            <span className="bg-yellow-500/20 text-yellow-500 text-xs px-3 py-1 font-mono rounded-full border border-yellow-500/30">
              {queue.length} Pending
            </span>
          </div>
          
          {queue.length === 0 ? (
            <div className="p-10 text-center text-zinc-500 flex flex-col items-center">
               <p className="font-medium text-lg text-white">Inbox Zero!</p>
               <p className="text-sm">All payments have been verified.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-zinc-500 bg-zinc-900 border-b border-white/5 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">Campaign Details</th>
                    <th className="px-6 py-4 font-medium">User Email</th>
                    <th className="px-6 py-4 font-medium text-center">Payment Proof</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 text-white">
                         <div className="font-bold">{item.title}</div>
                         <div className="text-xs text-zinc-400 font-mono">Ad ID: {item.id.split("-")[0]}</div>
                         <div className="text-xs text-emerald-500 font-semibold mt-1">Tier: {item.package?.name} (${item.payments?.[0]?.amount})</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                         {item.user?.email || item.userId}
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col items-center">
                            {item.payments?.[0]?.proofUrl ? (
                              <a href={item.payments[0].proofUrl} target="_blank" rel="noopener noreferrer" className="block relative h-16 w-16 mb-2 rounded border border-white/20 overflow-hidden hover:opacity-80 transition-opacity bg-zinc-950">
                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                 <img src={item.payments[0].proofUrl} alt="Payment Proof" className="object-cover w-full h-full" />
                              </a>
                            ) : (
                              <div className="h-16 w-16 bg-zinc-800 rounded mb-2 border border-white/10 flex items-center justify-center text-[10px] text-zinc-600 text-center leading-tight">No Proof</div>
                            )}
                            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">Ref: {item.payments?.[0]?.transactionRef || "N/A"}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                             onClick={() => handleVerify(item.id, "VERIFY")}
                             className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-black rounded text-xs font-bold transition-colors"
                          >
                             Approve & Publish
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "LOGS" && (
        <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-950/50">
            <div>
               <h2 className="text-xl font-bold">System Telemetry Logs</h2>
               <p className="text-xs text-zinc-500 mt-1">Real-time immutable database audit trail mapping state changes.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead className="text-zinc-500 bg-zinc-900 border-b border-white/5 uppercase text-xs">
                 <tr>
                   <th className="px-6 py-4 font-medium">Timestamp</th>
                   <th className="px-6 py-4 font-medium">Executor</th>
                   <th className="px-6 py-4 font-medium">Action Directive</th>
                   <th className="px-6 py-4 font-medium">Details</th>
                 </tr>
               </thead>
               <tbody className="font-mono">
                 {logs.map((log) => (
                   <tr key={log.id} className="border-b border-white/5 hover:bg-zinc-800/50 transition-colors">
                     <td className="px-6 py-4 text-zinc-500 text-xs">
                        {new Date(log.createdAt).toLocaleString()}
                     </td>
                     <td className="px-6 py-4 text-zinc-400 text-xs truncate max-w-[150px]">
                        {log.user?.email}
                     </td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                           log.action.includes("APPROVED") || log.action.includes("PUBLISHED") ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : 
                           log.action.includes("REJECTED") ? "bg-red-500/20 text-red-500 border border-red-500/30" :
                           "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        }`}>
                           {log.action}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-white text-xs">
                        {log.details}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}
    </div>
  );
}
