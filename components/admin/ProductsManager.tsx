'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface Tool {
  id: string;
  name: string;
  description: string;
  model_number: string;
  category: string;
  sub_category: string;
  rental_price_per_day: number;
  rental_price_per_week: number;
  rental_price_per_month: number;
  insurance_deposit: number;
  total_quantity: number;
  available_quantity: number;
  condition: string;
  image_urls: string[];
}

const CATEGORIES = [
  'Power Tools',
  'Hand Tools',
  'Measuring & Testing',
  'Safety Equipment',
  'Pneumatic Tools',
  'Hydraulic Tools',
  'Welding Equipment',
  'Cutting Tools',
  'Lifting Equipment',
  'Other'
];

const CONDITIONS = ['excellent', 'good', 'fair'];

export default function ProductsManager() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadingImages, setUploadingImages] = useState(false);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model_number: '',
    category: '',
    sub_category: '',
    rental_price_per_day: '',
    rental_price_per_week: '',
    rental_price_per_month: '',
    insurance_deposit: '',
    total_quantity: '1',
    available_quantity: '1',
    condition: 'good',
    image_urls: [] as string[]
  });

  useEffect(() => {
    fetchTools();
  }, []);

  async function fetchTools() {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      console.error('Error fetching tools:', error);
      toast.error('Failed to load tools');
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `tool-images/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('tools')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('tools')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setFormData(prev => ({
        ...prev,
        image_urls: [...prev.image_urls, ...uploadedUrls]
      }));

      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  }

  function removeImage(index: number) {
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const toolData = {
        name: formData.name,
        description: formData.description,
        model_number: formData.model_number,
        category: formData.category,
        sub_category: formData.sub_category,
        rental_price_per_day: parseFloat(formData.rental_price_per_day),
        rental_price_per_week: formData.rental_price_per_week ? parseFloat(formData.rental_price_per_week) : null,
        rental_price_per_month: formData.rental_price_per_month ? parseFloat(formData.rental_price_per_month) : null,
        insurance_deposit: parseFloat(formData.insurance_deposit),
        total_quantity: parseInt(formData.total_quantity),
        available_quantity: parseInt(formData.available_quantity),
        condition: formData.condition,
        image_urls: formData.image_urls
      };

      if (editingTool) {
        const { error } = await supabase
          .from('tools')
          .update(toolData)
          .eq('id', editingTool.id);

        if (error) throw error;
        toast.success('Tool updated successfully');
      } else {
        const { error } = await supabase
          .from('tools')
          .insert(toolData);

        if (error) throw error;
        toast.success('Tool added successfully');
      }

      resetForm();
      setIsDialogOpen(false);
      fetchTools();
    } catch (error) {
      console.error('Error saving tool:', error);
      toast.error('Failed to save tool');
    }
  }

  function openEditDialog(tool: Tool) {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description || '',
      model_number: tool.model_number || '',
      category: tool.category,
      sub_category: tool.sub_category || '',
      rental_price_per_day: tool.rental_price_per_day.toString(),
      rental_price_per_week: tool.rental_price_per_week?.toString() || '',
      rental_price_per_month: tool.rental_price_per_month?.toString() || '',
      insurance_deposit: tool.insurance_deposit.toString(),
      total_quantity: tool.total_quantity.toString(),
      available_quantity: tool.available_quantity.toString(),
      condition: tool.condition,
      image_urls: tool.image_urls || []
    });
    setIsDialogOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Tool deleted successfully');
      fetchTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast.error('Failed to delete tool');
    }
  }

  function resetForm() {
    setEditingTool(null);
    setFormData({
      name: '',
      description: '',
      model_number: '',
      category: '',
      sub_category: '',
      rental_price_per_day: '',
      rental_price_per_week: '',
      rental_price_per_month: '',
      insurance_deposit: '',
      total_quantity: '1',
      available_quantity: '1',
      condition: 'good',
      image_urls: []
    });
  }

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.model_number?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Products Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTool ? 'Edit Tool' : 'Add New Tool'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Tool Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="model_number">Model Number</Label>
                    <Input
                      id="model_number"
                      value={formData.model_number}
                      onChange={(e) => setFormData({...formData, model_number: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sub_category">Sub-Category</Label>
                    <Input
                      id="sub_category"
                      value={formData.sub_category}
                      onChange={(e) => setFormData({...formData, sub_category: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price_day">Price/Day (€) *</Label>
                    <Input
                      id="price_day"
                      type="number"
                      step="0.01"
                      value={formData.rental_price_per_day}
                      onChange={(e) => setFormData({...formData, rental_price_per_day: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_week">Price/Week (€)</Label>
                    <Input
                      id="price_week"
                      type="number"
                      step="0.01"
                      value={formData.rental_price_per_week}
                      onChange={(e) => setFormData({...formData, rental_price_per_week: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_month">Price/Month (€)</Label>
                    <Input
                      id="price_month"
                      type="number"
                      step="0.01"
                      value={formData.rental_price_per_month}
                      onChange={(e) => setFormData({...formData, rental_price_per_month: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deposit">Insurance Deposit (€) *</Label>
                    <Input
                      id="deposit"
                      type="number"
                      step="0.01"
                      value={formData.insurance_deposit}
                      onChange={(e) => setFormData({...formData, insurance_deposit: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITIONS.map(cond => (
                          <SelectItem key={cond} value={cond}>{cond.charAt(0).toUpperCase() + cond.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="total_qty">Total Quantity *</Label>
                    <Input
                      id="total_qty"
                      type="number"
                      min="1"
                      value={formData.total_quantity}
                      onChange={(e) => setFormData({...formData, total_quantity: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="avail_qty">Available Quantity *</Label>
                    <Input
                      id="avail_qty"
                      type="number"
                      min="0"
                      value={formData.available_quantity}
                      onChange={(e) => setFormData({...formData, available_quantity: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Product Images</Label>
                  <div className="mt-2">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                        </p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImages}
                      />
                    </label>
                  </div>
                  {formData.image_urls.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {formData.image_urls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img src={url} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTool ? 'Update Tool' : 'Add Tool'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price/Day</TableHead>
                <TableHead>Deposit</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell>
                    {tool.image_urls?.[0] ? (
                      <img src={tool.image_urls[0]} alt={tool.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center text-xs text-slate-500">No image</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{tool.name}</TableCell>
                  <TableCell>{tool.category}</TableCell>
                  <TableCell>€{tool.rental_price_per_day}</TableCell>
                  <TableCell>€{tool.insurance_deposit}</TableCell>
                  <TableCell>{tool.available_quantity}/{tool.total_quantity}</TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      tool.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                      tool.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tool.condition}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(tool)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(tool.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No tools found. Add your first product to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
