import { Check, Package, ClipboardCheck, Truck, Home, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type OrderStatus = 'placed' | 'pending' | 'payment_pending' | 'accepted' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'completed';

interface Props {
  status: OrderStatus | string;
  timestamps?: {
    created_at?: string;
    accepted_at?: string | null;
    packed_at?: string | null;
    shipped_at?: string | null;
    delivered_at?: string | null;
  };
}

const STEPS = [
  { key: 'placed', label: 'Placed', icon: Clock, tsKey: 'created_at' as const },
  { key: 'accepted', label: 'Accepted', icon: ClipboardCheck, tsKey: 'accepted_at' as const },
  { key: 'packed', label: 'Packed', icon: Package, tsKey: 'packed_at' as const },
  { key: 'shipped', label: 'Shipped', icon: Truck, tsKey: 'shipped_at' as const },
  { key: 'delivered', label: 'Delivered', icon: Home, tsKey: 'delivered_at' as const },
];

const ORDER = ['placed', 'accepted', 'packed', 'shipped', 'delivered'];

export function OrderTimeline({ status, timestamps }: Props) {
  // Treat 'pending' / 'payment_pending' as placed
  const normalized = ['pending', 'payment_pending', 'completed'].includes(status)
    ? (status === 'completed' ? 'delivered' : 'placed')
    : status;
  const currentIdx = ORDER.indexOf(normalized);

  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="flex items-start min-w-[480px]">
        {STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          const Icon = step.icon;
          const ts = timestamps?.[step.tsKey];
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <div
                  className={cn(
                    'absolute top-4 right-1/2 w-full h-0.5',
                    i <= currentIdx ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
              <div
                className={cn(
                  'relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors',
                  done ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-muted-foreground',
                  active && 'ring-2 ring-primary/30'
                )}
              >
                {done && !active ? <Check size={16} /> : <Icon size={16} />}
              </div>
              <p className={cn('text-[11px] mt-2 font-medium', done ? 'text-foreground' : 'text-muted-foreground')}>{step.label}</p>
              {ts && done && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTimeline;