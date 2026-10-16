import { useEffect, useState } from 'react';
import { useLang } from '../../contexts/LanguageContext';
import { useSound } from '../../hooks/useSound';
import { SHOP } from '../../config/shop';
import { uploadImage } from '../../utils/cloudinary';
import { makeVariantId, computeVariantPrice } from '../../utils/variants';

const emptyVariant = () => ({
  id: makeVariantId(),
  weight: '',
  mrp: '',
  discount: 0,
});

const EMPTY = {
  title: '',
  titleTa: '',
  description: '',
  descriptionTa: '',
  ingredients: '',
  preparation: '',
  category: 'dosa-mix',
  variants: [emptyVariant()],
  images: [],
  available: true,
  featured: false,
};

export default function ProductForm({ editing, onSave, onCancel }) {
  const { t } = useLang();
  const { play } = useSound();

  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      let variants;
      if (Array.isArray(editing.variants) && editing.variants.length > 0) {
        variants = editing.variants.map((v) => ({
          id: v.id || makeVariantId(),
          weight: v.weight || '',
          mrp: v.mrp || v.price || '',
          discount: v.discount || 0,
        }));
      } else {
        variants = [
          {
            id: makeVariantId(),
            weight: editing.weight || '',
            mrp: editing.mrp || editing.price || '',
            discount: editing.discount || 0,
          },
        ];
      }

      const legacyImages = [];
      if (Array.isArray(editing.images) && editing.images.length) {
        legacyImages.push(...editing.images);
      } else if (editing.imageUrl) {
        legacyImages.push(editing.imageUrl);
      }

      setForm({
        ...EMPTY,
        ...editing,
        variants,
        images: legacyImages,
        ingredients: Array.isArray(editing.ingredients)
          ? editing.ingredients.join(', ')
          : editing.ingredients || '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [editing]);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const addVariant = () => {
    play('click');
    setForm((f) => ({ ...f, variants: [...f.variants, emptyVariant()] }));
  };

  const removeVariant = (id) => {
    play('whoosh');
    setForm((f) => ({
      ...f,
      variants: f.variants.filter((v) => v.id !== id),
    }));
  };

  const updateVariant = (id, key, val) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v) => (v.id === id ? { ...v, [key]: val } : v)),
    }));
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError('');
    setUploading(true);
    play('click');

    const newUrls = [];
    try {
      for (let i = 0; i < files.length; i++) {
        setProgress(Math.round(((i + 0.5) / files.length) * 100));
        const res = await uploadImage(files[i]);
        newUrls.push(res.url);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...newUrls] }));
      play('sparkle');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Upload failed');
      play('buzz');
    } finally {
      setUploading(false);
      setProgress(0);
      e.target.value = '';
    }
  };

  const removeImage = (url) => {
    play('whoosh');
    setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) }));
  };

  const setAsMain = (url) => {
    play('click');
    setForm((f) => {
      const rest = f.images.filter((u) => u !== url);
      return { ...f, images: [url, ...rest] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError(t('productTitle') + ' required');
      play('buzz');
      return;
    }

    const validVariants = form.variants.filter((v) => Number(v.mrp) > 0);
    if (validVariants.length === 0) {
      setError(t('variantRequired'));
      play('buzz');
      return;
    }

    const cleanedVariants = validVariants.map((v) => ({
      id: v.id,
      weight: String(v.weight || '').trim(),
      mrp: Number(v.mrp) || 0,
      discount: Number(v.discount) || 0,
      price: computeVariantPrice(v.mrp, v.discount),
    }));

    const firstVariant = cleanedVariants[0];

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        titleTa: form.titleTa.trim(),
        description: form.description.trim(),
        descriptionTa: form.descriptionTa.trim(),
        ingredients: form.ingredients
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        preparation: form.preparation.trim(),
        category: form.category,
        variants: cleanedVariants,
        weight: firstVariant.weight,
        mrp: firstVariant.mrp,
        price: firstVariant.price,
        discount: firstVariant.discount,
        images: form.images,
        imageUrl: form.images[0] || '',
        available: !!form.available,
        featured: !!form.featured,
      };
      await onSave(payload);
      play('success');
      setForm({ ...EMPTY, variants: [emptyVariant()] });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Save failed');
      play('buzz');
    } finally {
      setSaving(false);
    }
  };

  const label =
    'text-xs font-bold text-trust-700 uppercase tracking-wide mb-1.5 block';

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-dark rounded-3xl p-5 md:p-7 animate-slide-up"
    >
      <h2 className="font-display text-xl font-extrabold text-trust-700 mb-4">
        {editing ? t('editProduct') : t('addProduct')}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={label}>{t('productTitle')} (EN) *</label>
          <input
            className="input-field"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Millet Dosa Premix"
          />
        </div>

        <div>
          <label className={label}>{t('productTitleTa')}</label>
          <input
            className="input-field"
            value={form.titleTa}
            onChange={(e) => update('titleTa', e.target.value)}
            placeholder="மில்லெட் தோசை மாவு"
          />
        </div>

        <div className="md:col-span-2">
          <label className={label}>{t('category')}</label>
          <select
            className="input-field"
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
          >
            {SHOP.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VARIANTS */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <label className={label}>{t('variants')} *</label>
          <button
            type="button"
            onClick={addVariant}
            className="text-xs font-bold text-trust-700 hover:text-fresh-600 transition flex items-center gap-1"
          >
            ➕ {t('addVariant')}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {form.variants.map((v) => {
            const price = computeVariantPrice(v.mrp, v.discount);
            return (
              <div
                key={v.id}
                className="rounded-2xl border-2 border-trust-100 bg-white/60 p-3 grid grid-cols-12 gap-2 items-end"
              >
                <div className="col-span-12 sm:col-span-4">
                  <label className="text-[10px] font-bold text-trust-700 uppercase tracking-wide mb-1 block">
                    {t('variantWeight')}
                  </label>
                  <input
                    className="input-field py-2 text-sm"
                    value={v.weight}
                    onChange={(e) =>
                      updateVariant(v.id, 'weight', e.target.value)
                    }
                    placeholder="500g"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label className="text-[10px] font-bold text-trust-700 uppercase tracking-wide mb-1 block">
                    {t('mrp')} (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="input-field py-2 text-sm"
                    value={v.mrp}
                    onChange={(e) => updateVariant(v.id, 'mrp', e.target.value)}
                    placeholder="150"
                  />
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <label className="text-[10px] font-bold text-trust-700 uppercase tracking-wide mb-1 block">
                    %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    className="input-field py-2 text-sm"
                    value={v.discount}
                    onChange={(e) =>
                      updateVariant(v.id, 'discount', e.target.value)
                    }
                    placeholder="0"
                  />
                </div>

                <div className="col-span-9 sm:col-span-2">
                  <label className="text-[10px] font-bold text-trust-700 uppercase tracking-wide mb-1 block">
                    {t('price')}
                  </label>
                  <div className="input-field py-2 text-sm bg-trust-50 font-extrabold text-trust-700 flex items-center justify-center">
                    ₹{price}
                  </div>
                </div>

                <div className="col-span-3 sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVariant(v.id)}
                    disabled={form.variants.length === 1}
                    className={`p-2 rounded-lg transition ${
                      form.variants.length === 1
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-red-50 text-red-500'
                    }`}
                    title={t('removeVariant')}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-ink/50 mt-2">
          Each weight can have its own MRP & discount. Price is auto-calculated.
        </p>
      </div>

      <div className="mt-4 flex items-center gap-6 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => update('available', e.target.checked)}
            className="w-4 h-4 accent-trust-500"
          />
          <span className="text-sm font-semibold">{t('available')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update('featured', e.target.checked)}
            className="w-4 h-4 accent-amber-500"
          />
          <span className="text-sm font-semibold">⭐ {t('featured')}</span>
        </label>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <label className={label}>{t('productDescription')} (EN)</label>
          <textarea
            rows={3}
            className="input-field resize-none"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>
        <div>
          <label className={label}>{t('productDescriptionTa')}</label>
          <textarea
            rows={3}
            className="input-field resize-none"
            value={form.descriptionTa}
            onChange={(e) => update('descriptionTa', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <label className={label}>{t('productIngredients')}</label>
          <input
            className="input-field"
            value={form.ingredients}
            onChange={(e) => update('ingredients', e.target.value)}
            placeholder="Ragi, Kambu, Urad dal"
          />
        </div>
        <div>
          <label className={label}>{t('productPreparation')}</label>
          <input
            className="input-field"
            value={form.preparation}
            onChange={(e) => update('preparation', e.target.value)}
            placeholder="Mix with water, ferment 4 hours"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className={label}>
          {t('productImage')} {form.images.length > 0 && `(${form.images.length})`}
        </label>
        <p className="text-[11px] text-ink/50 mb-2">{t('imagesHint')}</p>

        {form.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {form.images.map((url, idx) => (
              <div
                key={url + idx}
                className="relative aspect-square rounded-2xl overflow-hidden border-2 border-trust-100 bg-trust-50 group"
              >
                <img
                  src={url}
                  alt={`Product ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-fresh-500 text-white text-[10px] font-bold shadow">
                    {t('mainImage')}
                  </span>
                )}
                <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => setAsMain(url)}
                      className="px-2 py-1 rounded-lg bg-white text-trust-700 text-[10px] font-bold hover:bg-trust-50 transition w-full"
                    >
                      ⭐ {t('setAsMain')}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="px-2 py-1 rounded-lg bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 transition w-full"
                  >
                    ✕ {t('removeImage')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <label
          className={`block w-full px-4 py-4 rounded-2xl border-2 border-dashed cursor-pointer text-center transition-all ${
            uploading
              ? 'border-trust-400 bg-trust-50'
              : 'border-trust-200 hover:border-trust-400 hover:bg-trust-50'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            disabled={uploading}
            className="hidden"
          />
          <span className="text-sm font-semibold text-trust-700">
            {uploading
              ? `⏳ Uploading... ${progress}%`
              : form.images.length > 0
              ? `➕ ${t('addMoreImages')}`
              : `📤 ${t('uploadImages')}`}
          </span>
        </label>

        {uploading && (
          <div className="mt-2 h-1.5 rounded-full bg-trust-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-trust-500 to-fresh-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => {
            play('click');
            onCancel?.();
          }}
          className="btn-secondary flex-1"
          disabled={saving}
        >
          {t('cancel')}
        </button>
        <button type="submit" className="btn-primary flex-1" disabled={saving}>
          {saving ? t('loading') : `✓ ${t('save')}`}
        </button>
      </div>
    </form>
  );
}