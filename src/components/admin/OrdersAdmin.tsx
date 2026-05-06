import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, MessageCircle, Truck, Package, ClipboardCheck, Home, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { openWhatsApp, OrderEvent } from '@/lib/whatsapp';

const STATUSES = ['placed', 'accepted', 'packed', 'shipped', 'delivered', 'cancelled'];

export const OrdersAdmin = () => {
  const qc = useQueryClient();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [tracking, setTracking] = useState<Record<string, { tracking_number?: string; courier?: string }>>({});

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return data as any[];
    },
  });

  const updateStatus = async (order: any, newStatus: string) => {
    setSavingId(order.id);
    const tsField: Record<string, string> = {
      accepted: 'accepted_at', packed: 'packed_at', shipped: 'shipped_at', delivered: 'delivered_at',
    };
    const update: any = { status: newStatus };
    if (tsField[newStatus]) update[tsField[newStatus]] = new Date().toISOString();
    const trk = tracking[order.id];
    if (newStatus === 'shipped' && trk) {
      if (trk.tracking_number) update.tracking_number = trk.tracking_number;
      if (trk.courier) update.courier = trk.courier;
    }
    const { error } = await supabase.from('orders').update(update).eq('id', order.id);
    setSavingId(null);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: '✅ Updated', description: `Order ${order.order_number} → ${newStatus}` });
    qc.invalidateQueries({ queryKey: ['admin-orders'] });

    // Auto-prompt WA for major events
    const eventMap: Record<string, OrderEvent> = { accepted: 'accepted', shipped: 'shipped', delivered: 'delivered' };
    if (eventMap[newStatus] && order.customer_phone) {
      if (confirm(`Send WhatsApp "${newStatus}" notification to ${order.customer_name}?`)) {
        openWhatsApp(order.customer_phone, eventMap[newStatus], {
          orderNumber: order.order_number,
          customerName: order.customer_name,
          total: order.total_amount,
          tracking: update.tracking_number || order.tracking_number,
          courier: update.courier || order.courier,
        });
      }
    }
  };

  const sendWA = (order: any, event: OrderEvent) => {
    if (!order.customer_phone) { toast({ title: 'No phone', description: 'Customer phone missing', variant: 'destructive' }); return; }
    openWhatsApp(order.customer_phone, event, {
      orderNumber: order.order_number, customerName: order.customer_name,
      total: order.total_amount, tracking: order.tracking_number, courier: order.courier,
    });
  };

  if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary"/></div>;

  return (
    <div className="p-4 space-y-3">
      <h2 className="font-serif text-lg font-bold text-foreground">Orders ({orders.length})</h2>
      {orders.map((o: any) => (
        <div key={o.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <p className="font-semibold text-sm">{o.order_number}</p>
              <p className="text-xs text-muted-foreground">{o.customer_name} • {o.customer_phone}</p>
              <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">₹{Number(o.total_amount).toFixed(2)}</p>
              <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded bg-secondary">{o.status}</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {STATUSES.map(s => (
              <button key={s} disabled={savingId === o.id || o.status === s}
                onClick={() => updateStatus(o, s)}
                className={`text-xs px-2.5 py-1 rounded-lg border ${o.status === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'}`}>
                {s}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Tracking number" defaultValue={o.tracking_number || ''}
              onChange={e => setTracking(p => ({ ...p, [o.id]: { ...p[o.id], tracking_number: e.target.value } }))}
              className="px-2 py-1.5 text-xs rounded-lg border border-border bg-background"/>
            <input placeholder="Courier" defaultValue={o.courier || ''}
              onChange={e => setTracking(p => ({ ...p, [o.id]: { ...p[o.id], courier: e.target.value } }))}
              className="px-2 py-1.5 text-xs rounded-lg border border-border bg-background"/>
          </div>

          <div className="flex gap-1.5 flex-wrap pt-1 border-t border-border">
            <button onClick={() => sendWA(o, 'placed')} className="text-[10px] inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary hover:bg-secondary/70"><MessageCircle size={11}/> Placed</button>
            <button onClick={() => sendWA(o, 'accepted')} className="text-[10px] inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary hover:bg-secondary/70"><ClipboardCheck size={11}/> Accepted</button>
            <button onClick={() => sendWA(o, 'shipped')} className="text-[10px] inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary hover:bg-secondary/70"><Truck size={11}/> Shipped</button>
            <button onClick={() => sendWA(o, 'delivered')} className="text-[10px] inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary hover:bg-secondary/70"><Home size={11}/> Delivered</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersAdmin;