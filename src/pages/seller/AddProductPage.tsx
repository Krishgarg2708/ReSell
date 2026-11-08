import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Image as ImageIcon,
  Tag, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../../store/useAppStore';
import { CATEGORIES } from '../../data/categories';
import { ProductCondition, Product } from '../../types';

export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { addProduct, currentUser } = useAppStore();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Smartphones');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState<ProductCondition>('Like New');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'Includes original retail packaging and charger',
    'Carefully maintained in smoke-free home',
  ]);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [specs, setSpecs] = useState<Record<string, string>>({
    'Battery Health': '95%',
    'Warranty': '6 Months Valid with Invoice',
  });
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  // Images state
  const [images, setImages] = useState<string[]>([
    '/src/assets/images/resell_hero_marketplace_1794130051291.jpg',
  ]);
  const [coverIndex, setCoverIndex] = useState(0);

  // Seller & Fulfillment
  const [sellerCity, setSellerCity] = useState('Bengaluru');
  const [deliveryOption, setDeliveryOption] = useState<'Delivery & Pickup' | 'Delivery Only' | 'Pickup Only'>('Delivery & Pickup');

  const [error, setError] = useState('');

  const conditionDescriptions: Record<ProductCondition, string> = {
    'Brand New': 'Original factory sealed or untouched packaging with all accessories.',
    'Like New': 'Pristine cosmetic and internal state. Zero visible marks or blemishes.',
    'Excellent': 'Gently used with minimal imperceptible micro-marks. 100% operational.',
    'Good': 'Light cosmetic wear from everyday normal use. Tested and verified.',
    'Fair': 'Noticeable cosmetic wear, but fully operational and functionally sound.',
  };

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures([...features, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddSpec = () => {
    if (specKey.trim() && specValue.trim()) {
      setSpecs({ ...specs, [specKey.trim()]: specValue.trim() });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleRemoveSpec = (key: string) => {
    const copy = { ...specs };
    delete copy[key];
    setSpecs(copy);
  };

  // Simulated browser file API preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    if (images.length === 1) {
      setError('You must keep at least 1 photo for your listing.');
      return;
    }
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    if (coverIndex >= updated.length) {
      setCoverIndex(0);
    }
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1) {
      if (!title.trim() || !brand.trim()) {
        setError('Please provide a title and brand.');
        return;
      }
    } else if (currentStep === 3) {
      if (!price || Number(price) <= 0) {
        setError('Please enter a valid asking price.');
        return;
      }
    } else if (currentStep === 4) {
      if (!description.trim()) {
        setError('Please write a brief description of the item.');
        return;
      }
    }
    setCurrentStep((s) => Math.min(7, s + 1));
  };

  const handlePublish = () => {
    const published = addProduct({
      title,
      brand,
      model: model || brand,
      category,
      condition,
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price) * 1.35,
      description,
      features,
      specs,
      images,
      coverImage: images[coverIndex] || images[0],
      sellerId: 'seller-demo',
      sellerName: 'Arjun Mehta (Demo Seller)',
      sellerCity,
      sellerRating: 4.9,
      isSellerVerified: true,
      status: 'Active',
      isNegotiable,
      deliveryOption,
      featured: true,
    });

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    navigate(`/products/${published.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          List Your Pre-Owned Item
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          7-step guided workflow to present and price your listing for buyers across India.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto pb-2 sm:pb-0 gap-2">
          {[
            { step: 1, label: 'Basics' },
            { step: 2, label: 'Condition' },
            { step: 3, label: 'Pricing' },
            { step: 4, label: 'Specs' },
            { step: 5, label: 'Photos' },
            { step: 6, label: 'Delivery' },
            { step: 7, label: 'Publish' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-2 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === item.step
                    ? 'bg-blue-600 text-white shadow-xs'
                    : currentStep > item.step
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {currentStep > item.step ? '✓' : item.step}
              </div>
              <span className={`text-xs font-semibold hidden md:inline ${
                currentStep === item.step ? 'text-slate-900 dark:text-white' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
              {item.step < 7 && <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Step Container */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 1: Basic Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Apple MacBook Pro 14 M2 (16GB / 512GB)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Apple, Sony, Leica, Herman Miller"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Model / Variant
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. A2779 Space Grey"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Condition */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 2: Product Condition</h2>
            <p className="text-xs text-slate-500">Accurately rating your item's condition builds trust and avoids returns.</p>

            <div className="space-y-2">
              {(['Brand New', 'Like New', 'Excellent', 'Good', 'Fair'] as ProductCondition[]).map((cond) => (
                <label
                  key={cond}
                  onClick={() => setCondition(cond)}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    condition === cond
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="condition"
                    checked={condition === cond}
                    onChange={() => setCondition(cond)}
                    className="mt-0.5 text-blue-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">{cond}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {conditionDescriptions[cond]}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Pricing */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 3: Pricing & Negotiation</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Asking Price (₹) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="e.g. 52000"
                  className="w-full px-3 py-2 text-sm font-bold tabular-nums rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Original Retail Price (₹) (Optional)
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  placeholder="e.g. 89900"
                  className="w-full px-3 py-2 text-sm font-bold tabular-nums rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Allow Price Negotiations
                </span>
                <span className="text-[11px] text-slate-500">
                  Buyers can send direct offers and counteroffers inside in-app chat
                </span>
              </div>
              <input
                type="checkbox"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Description & Specs */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 4: Product Description & Features</h2>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Mention usage history, warranty status, battery cycle count, reason for selling..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none resize-none"
              />
            </div>

            {/* Bullet features */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Key Features
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  placeholder="e.g. Battery health at 96%"
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-1">
                {features.map((feat, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs">
                    <span>{feat}</span>
                    <button type="button" onClick={() => handleRemoveFeature(i)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Images */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 5: Photos & Cover Photo</h2>
            <p className="text-xs text-slate-500">Clear photos from multiple angles help items sell 3x faster.</p>

            {/* File upload button */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2 hover:border-blue-500 transition-colors cursor-pointer relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 mx-auto text-blue-600" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Click to upload photos from device
              </p>
              <p className="text-[11px] text-slate-400">PNG, JPG up to 10MB each</p>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-square bg-slate-100">
                  <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white text-[10px]">
                    <button
                      type="button"
                      onClick={() => setCoverIndex(idx)}
                      className={`px-2 py-0.5 rounded ${coverIndex === idx ? 'bg-blue-600 font-bold' : 'bg-black/60'}`}
                    >
                      {coverIndex === idx ? '★ Cover' : 'Make Cover'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="self-end p-1 rounded bg-red-600/80 hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Seller Details & Delivery */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 6: Location & Delivery Preference</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Location / Metro City *
                </label>
                <select
                  value={sellerCity}
                  onChange={(e) => setSellerCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="New Delhi">New Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Options *
                </label>
                <div className="space-y-2">
                  {[
                    'Delivery & Pickup',
                    'Delivery Only',
                    'Pickup Only',
                  ].map((opt) => (
                    <label
                      key={opt}
                      onClick={() => setDeliveryOption(opt as any)}
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer text-xs ${
                        deliveryOption === opt
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={deliveryOption === opt}
                        onChange={() => setDeliveryOption(opt as any)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Preview & Publish */}
        {currentStep === 7 && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 7: Preview & Confirmation</h2>
            <p className="text-xs text-slate-500">Review your listing as buyers will see it on the marketplace.</p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center">
              <img
                src={images[coverIndex] || images[0]}
                alt="Cover Preview"
                className="w-32 h-32 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
              />
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {condition} · {category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
                <div className="text-lg font-extrabold tabular-nums text-slate-900 dark:text-white">
                  ₹{Number(price).toLocaleString('en-IN')}
                </div>
                <p className="text-slate-500 line-clamp-2">{description}</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Location: {sellerCity} · {deliveryOption} · {isNegotiable ? 'Negotiable' : 'Fixed Price'}
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Listing will be live immediately in the ReSell catalog!</span>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Publish Listing Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
