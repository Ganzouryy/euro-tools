'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Eye, Send } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface CustomRequest {
  id: string;
  request_number: string;
  tool_description: string;
  specifications: string;
  purpose: string;
  preferred_rental_duration: string;
  budget_range: string;
  status: string;
  admin_notes: string;
  quoted_price: number;
  created_at: string;
  users: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
}

const REQUEST_STATUSES = [
  'submitted',
  'under_review',
  'quoted',
  'accepted',
  'rejected',
  'fulfilled'
];

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  quoted: 'bg-purple-100 text-purple-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  fulfilled: 'bg-slate-100 text-slate-800'
};

export default function CustomRequestsManager() {
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('submitted');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  async function fetchRequests() {
    try {
      let query = supabase
        .from('custom_requests')
        .select(`
          *,
          users (
            email,
            first_name,
            last_name,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load custom requests');
    } finally {
      setLoading(false);
    }
  }

  async function updateRequestStatus(requestId: string, newStatus: string, price?: number, notes?: string) {
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (price !== undefined) {
        updateData.quoted_price = price;
      }

      if (notes !== undefined) {
        updateData.admin_notes = notes;
      }

      const { error } = await supabase
        .from('custom_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Request updated successfully');
      setIsDialogOpen(false);
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    }
  }

  function viewRequestDetails(request: CustomRequest) {
    setSelectedRequest(request);
    setQuotedPrice(request.quoted_price?.toString() || '');
    setAdminNotes(request.admin_notes || '');
    setIsDialogOpen(true);
  }

  async function handleSendQuote() {
    if (!selectedRequest || !quotedPrice) {
      toast.error('Please enter a quoted price');
      return;
    }

    await updateRequestStatus(
      selectedRequest.id,
      'quoted',
      parseFloat(quotedPrice),
      adminNotes
    );
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.request_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.tool_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.users?.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Tool Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'submitted' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('submitted')}
            >
              New
            </Button>
            <Button
              variant={statusFilter === 'under_review' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('under_review')}
            >
              In Review
            </Button>
            <Button
              variant={statusFilter === 'quoted' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('quoted')}
            >
              Quoted
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
                <TableHead>Request #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Tool Description</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.request_number}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.users?.first_name} {request.users?.last_name}</div>
                      <div className="text-sm text-muted-foreground">{request.users?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{request.tool_description}</TableCell>
                  <TableCell>{request.budget_range || 'Not specified'}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[request.status]}>
                      {request.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(request.created_at), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => viewRequestDetails(request)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No custom requests found.
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Custom Request - {selectedRequest?.request_number}</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedRequest.users?.first_name} {selectedRequest.users?.last_name}</p>
                    <p><span className="font-medium">Email:</span> {selectedRequest.users?.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedRequest.users?.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Tool Requirements</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="mt-1 text-muted-foreground">{selectedRequest.tool_description}</p>
                    </div>
                    {selectedRequest.specifications && (
                      <div>
                        <span className="font-medium">Specifications:</span>
                        <p className="mt-1 text-muted-foreground">{selectedRequest.specifications}</p>
                      </div>
                    )}
                    {selectedRequest.purpose && (
                      <div>
                        <span className="font-medium">Purpose:</span>
                        <p className="mt-1 text-muted-foreground">{selectedRequest.purpose}</p>
                      </div>
                    )}
                    {selectedRequest.preferred_rental_duration && (
                      <p><span className="font-medium">Rental Duration:</span> {selectedRequest.preferred_rental_duration}</p>
                    )}
                    {selectedRequest.budget_range && (
                      <p><span className="font-medium">Budget Range:</span> {selectedRequest.budget_range}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Current Status</h3>
                  <Badge className={STATUS_COLORS[selectedRequest.status]}>
                    {selectedRequest.status.replace(/_/g, ' ')}
                  </Badge>
                </div>

                {selectedRequest.status === 'submitted' || selectedRequest.status === 'under_review' ? (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label htmlFor="quoted_price">Quoted Price (€) *</Label>
                      <Input
                        id="quoted_price"
                        type="number"
                        step="0.01"
                        value={quotedPrice}
                        onChange={(e) => setQuotedPrice(e.target.value)}
                        placeholder="Enter quoted price"
                      />
                    </div>

                    <div>
                      <Label htmlFor="admin_notes">Admin Notes (Optional)</Label>
                      <Textarea
                        id="admin_notes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add any notes or conditions..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => updateRequestStatus(selectedRequest.id, 'under_review')}
                      >
                        Mark as Under Review
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => updateRequestStatus(selectedRequest.id, 'rejected', undefined, adminNotes)}
                      >
                        Reject Request
                      </Button>
                      <Button onClick={handleSendQuote}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Quote
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-4 border-t">
                    {selectedRequest.quoted_price && (
                      <p className="text-sm"><span className="font-medium">Quoted Price:</span> €{selectedRequest.quoted_price.toFixed(2)}</p>
                    )}
                    {selectedRequest.admin_notes && (
                      <div className="text-sm">
                        <span className="font-medium">Admin Notes:</span>
                        <p className="mt-1 text-muted-foreground">{selectedRequest.admin_notes}</p>
                      </div>
                    )}
                    {selectedRequest.status === 'quoted' && (
                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                        >
                          Mark as Rejected
                        </Button>
                        <Button
                          onClick={() => updateRequestStatus(selectedRequest.id, 'accepted')}
                        >
                          Mark as Accepted
                        </Button>
                      </div>
                    )}
                    {selectedRequest.status === 'accepted' && (
                      <div className="flex justify-end pt-2">
                        <Button
                          onClick={() => updateRequestStatus(selectedRequest.id, 'fulfilled')}
                        >
                          Mark as Fulfilled
                        </Button>
                      </div>
                    )}
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
