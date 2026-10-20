import { useShipping } from '../../contexts/ShippingContext';
import { formatPrice } from '../../utils/format';

export default function ShippingWidget() {
  const { shippingMethods } = useShipping();

  if (!shippingMethods.length) return null;

  return (
    <div className="glass rounded-2xl p-4 mb-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🚚</span>
        <h3 className="font-display font-extrabold text-trust-700 text-sm">
          Shipping Information
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {shippingMethods.map((method) => (
          <div 
            key={method.id} 
            className="flex-1 min-w-[150px] bg-white/60 rounded-xl p-3 border border-trust-100"
          >
            <p className="text-xs font-bold text-ink">{method.name}</p>
            <p className="text-[10px] text-ink/50 mb-2">{method.desc}</p>
            <p className="text-sm font-extrabold text-trust-700">
              {method.cost === 0 ? 'FREE' : formatPrice(method.cost)}
            </p>
            {method.freeAbove && (
              <p className="text-[9px] text-fresh-600 font-semibold mt-0.5">
                Free above {formatPrice(method.freeAbove)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}