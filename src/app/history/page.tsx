"use client";
import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, Badge, Button, AlertDialog, Skeleton, EmptyState } from '@/components/ui';
import { fetchHistory } from '@/lib/api/history';
import { HistoryRecord } from '@/types';
import { Search, Trash2, ChevronLeft, ChevronRight, Eye, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/providers';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchHistory().then(data => {
      // Sort by newest first
      setHistory(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setLoading(false);
    });
  }, []);

  const filtered = history.filter(h => 
    h.scanType.includes(search.toLowerCase()) || 
    h.verdict.toLowerCase().includes(search.toLowerCase()) ||
    (h.summary && h.summary.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleDelete = () => {
    if (!deleteId) return;
    
    // Optimistic Delete UI
    setHistory(prev => prev.filter(h => h.id !== deleteId));
    setDeleteId(null);
    
    // Fake API Call to delete (In real app, call DELETE /api/history?id=...)
    toast({ 
      type: 'success', 
      title: 'Record Deleted', 
      description: 'The scan record was successfully removed.',
      // Future: Add action to undo by restoring recordToDelete
    });
    
    // Adjust page if empty
    if (paginated.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <AppShell>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold">Threat History</h1>
          <p className="text-neutral">Review past scans and analysis reports.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-neutral" size={18} />
          <input 
            type="text" 
            placeholder="Search scans, verdicts..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-card border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState 
            icon={ShieldAlert}
            title="No History Found"
            description={search ? "No records matched your search query." : "You haven't run any threat analyses yet."}
            actionLabel={search ? "Clear Search" : "Run First Scan"}
            onAction={() => search ? setSearch('') : router.push('/dashboard')}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-card/50 border-b border-border text-neutral">
                  <tr>
                    <th className="px-6 py-4 font-medium">Scan Type</th>
                    <th className="px-6 py-4 font-medium">Verdict</th>
                    <th className="px-6 py-4 font-medium">Risk Score</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">Summary</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <AnimatePresence initial={false}>
                    {paginated.map(record => (
                      <motion.tr 
                        key={record.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, x: -20 }}
                        className="hover:bg-card/30 transition-colors group"
                      >
                        <td className="px-6 py-4 capitalize font-medium text-foreground">
                          {record.scanType}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={record.riskScore > 60 ? 'danger' : record.riskScore > 30 ? 'warning' : 'success'}>
                            {record.verdict}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${record.riskScore > 60 ? 'text-red-400' : record.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {record.riskScore}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell text-neutral max-w-[200px] truncate">
                          {record.summary || 'No summary available.'}
                        </td>
                        <td className="px-6 py-4 text-neutral">
                          {new Date(record.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="sm" className="h-8 px-2" onClick={() => router.push(`/report/${record.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="secondary" size="sm" className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => setDeleteId(record.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-card/20">
              <span className="text-sm text-neutral">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} entries
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <AlertDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Scan Record"
        description="Are you sure you want to delete this scan record? It will be permanently removed from your threat history."
        confirmText="Delete Record"
        isDestructive={true}
      />
    </AppShell>
  );
}
