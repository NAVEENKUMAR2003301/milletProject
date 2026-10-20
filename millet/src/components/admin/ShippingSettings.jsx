import { useState, useEffect } from 'react';
import { useShipping } from '../../contexts/ShippingContext';
import { useSound } from '../../hooks/useSound';

export default function ShippingSettings() {
  const { shippingMethods, updateShippingMethods } = useShipping();
  const { play } = useSound();
  
  const [form, setForm] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(JSON.parse(JSON.stringify(shippingMethods)));
  }, [shippingMethods]);

  const handleSave = async () => {
    setSaving(true);
    play('click');
    try {
      await updateShippingMethods(form);
      play('success');
      alert('Shipping charges updated successfully!');
    } catch (err) {
      console.error(err);
      play('buzz');
      alert('Failed to update shipping.');
    } finally {
      setSaving(false);
    }
  };

  const updateMethod = (index, key, value) => {
    const newForm = [...form];
    newForm[index][key] = value;
    setForm(newForm);
  };

  const label = 'text-xs font-bold text-trust-700 uppercase tracking-wide mb-1.5 block';

  return (
    <div className="glass-dark rounded-3xl p-5 md:p-7 animate-slide-up max-w-2xl">
      <h2 className="font-display text-xl font-extrabold text-trust-700 mb-6">
        🚚 Shipping Charges Settings
      </h2>

      <div className="flex flex-col gap-6">
        {form.map((method, idx) => (
          <div key={method.id} className="p-4 rounded-2xl bg-white/50 border border-trust-100">
            <h3 className="font-bold text-ink mb-3">{method.name}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Delivery Charge (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="input-field"
                  value={method.cost}
                  onChange={(e) => updateMethod(idx, 'cost', Number(e.target.value))}
                />
              </div>
              
              <div>
                <label className={label}>Free Delivery Above (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="input-field"
                  value={method.freeAbove || ''}
                  placeholder="Leave empty if not applicable"
                  onChange={(e) => {
                    const val = e.target.value === '' ? null : Number(e.target.value);
                    updateMethod(idx, 'freeAbove', val);
                  }}
                  disabled={method.id === 'pickup'}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full"
        >
          {saving ? 'Saving...' : '💾 Save Shipping Charges'}
        </button>
      </div>
    </div>
  );
}