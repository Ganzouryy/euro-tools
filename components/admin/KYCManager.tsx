'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface KYCUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  kyc_status: string;
  kyc_document_urls: string[];
  kyc_submitted_at: string;
  created_at: string;
}

export default function KYCManager() {
  const [users, setUsers] = useState<KYCUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<KYCUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  async function fetchUsers() {
    try {
      let query = supabase
        .from('users')
        .select('*')
        .order('kyc_submitted_at', { ascending: false, nullsFirst: false });

      if (statusFilter !== 'all') {
        query = query.eq('kyc_status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load KYC submissions');
    } finally {
      setLoading(false);
    }
  }

  async function updateKYCStatus(userId: string, newStatus: 'verified' | 'rejected') {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          kyc_status: newStatus,
          kyc_verified_at: newStatus === 'verified' ? new Date().toISOString() : null
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`KYC ${newStatus === 'verified' ? 'approved' : 'rejected'} successfully`);
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating KYC status:', error);
      toast.error('Failed to update KYC status');
    }
  }

  function viewUserDetails(user: KYCUser) {
    setSelectedUser(user);
    setIsDialogOpen(true);
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC Verification Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === 'verified' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('verified')}
            >
              Verified
            </Button>
            <Button
              variant={statusFilter === 'rejected' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('rejected')}
            >
              Rejected
            </Button>
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {user.kyc_submitted_at
                      ? format(new Date(user.kyc_submitted_at), 'MMM dd, yyyy')
                      : 'Not submitted'}
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      user.kyc_status === 'verified' ? 'bg-green-100 text-green-800' :
                      user.kyc_status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {user.kyc_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => viewUserDetails(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No KYC submissions found.
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>KYC Verification - {selectedUser?.first_name} {selectedUser?.last_name}</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">User Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedUser.first_name} {selectedUser.last_name}</p>
                    <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedUser.phone}</p>
                    <p><span className="font-medium">Status:</span>
                      <Badge className={`ml-2 ${
                        selectedUser.kyc_status === 'verified' ? 'bg-green-100 text-green-800' :
                        selectedUser.kyc_status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedUser.kyc_status}
                      </Badge>
                    </p>
                  </div>
                </div>

                {selectedUser.kyc_document_urls && selectedUser.kyc_document_urls.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Submitted Documents</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedUser.kyc_document_urls.map((url, index) => (
                        <div key={index} className="border rounded-lg p-2">
                          <img
                            src={url}
                            alt={`Document ${index + 1}`}
                            className="w-full h-48 object-contain rounded cursor-pointer hover:opacity-90"
                            onClick={() => window.open(url, '_blank')}
                          />
                          <p className="text-xs text-center mt-2 text-muted-foreground">
                            Click to view full size
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedUser.kyc_status === 'pending' && (
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="destructive"
                      onClick={() => updateKYCStatus(selectedUser.id, 'rejected')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => updateKYCStatus(selectedUser.id, 'verified')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
