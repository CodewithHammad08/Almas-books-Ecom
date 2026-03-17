import React, { useState, useRef } from 'react'
import { Upload, X, FileText, Printer, CheckCircle } from 'lucide-react';
import api from '../api/axios';

const PrintForm = () => {
  const [formData, setFormData] = useState({
    copies: 1,
    printType: 'Black & White',
    paperSize: 'A4',
    bindingType: 'none',
    name: '',
    phone: '',
    notes: ''
  });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      // 50MB limit
      if (f.size > 50 * 1024 * 1024) {
        setError("File size must be under 50MB");
        return;
      }
      setFile(f);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setError(null); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!file) { setError("Please select a file to print"); return; }
    if (!formData.name || !formData.phone) { setError("Name and Phone number are required"); return; }

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formPayload = new FormData();
      formPayload.append('document', file);
      formPayload.append('copies', formData.copies);
      formPayload.append('printType', formData.printType);
      formPayload.append('paperSize', formData.paperSize);
      formPayload.append('bindingType', formData.bindingType);
      formPayload.append('name', formData.name);
      formPayload.append('phone', formData.phone);
      formPayload.append('notes', formData.notes);

      await api.post('/print-request', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(pct);
        }
      });
      setSubmitted(true);
      setFile(null);
      setFormData({ copies: 1, printType: 'Black & White', paperSize: 'A4', bindingType: 'none', name: '', phone: '', notes: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit print request. Please try again.');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  // ─── SUCCESS STATE ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto bg-neutral-900 border border-green-500/30 rounded-3xl shadow-xl p-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Request Submitted!</h2>
          <p className="text-neutral-400 mb-2 max-w-md">
            Your print request has been received. We'll process it shortly and notify you.
          </p>
          <p className="text-amber-500 font-medium text-sm mb-8">You can also contact us on WhatsApp for status updates.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-3 rounded-xl transition-all"
          >
            Submit Another Request
          </button>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl shadow-xl p-6 md:p-10">

          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold flex items-center justify-center md:justify-start gap-3 text-white mb-2">
              Upload Documents for Printing
            </h2>
            <p className="text-neutral-400">
              Upload your file (PDF, DOC, DOCX, JPG, PNG) and we'll print it for you.
            </p>
          </div>

          {/* Upload Box */}
          <div
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center mb-8 cursor-pointer transition-all group ${file ? 'border-green-500 bg-green-500/5' : 'border-neutral-700 hover:border-amber-500 hover:bg-neutral-800/50'}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />

            {file ? (
              <div className="flex flex-col items-center">
                <div className="bg-neutral-800 p-4 rounded-full shadow-sm mb-4 relative">
                  <FileText size={32} className="text-green-500" />
                  <button
                    onClick={e => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="font-bold text-white text-lg">{file.name}</p>
                <p className="text-sm text-green-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB · Ready to upload</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col text-neutral-500 mb-4 items-center group-hover:text-amber-500 transition-colors">
                  <Upload size={48} strokeWidth={1.5} />
                </div>
                <p className="font-bold text-white text-lg mb-1">Click to upload or drag & drop</p>
                <p className="text-sm text-neutral-500">PDF, DOC, DOCX, JPG, PNG · Max 50MB</p>
              </>
            )}
          </div>

          {/* Upload Progress */}
          {isLoading && uploadProgress > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
                <span>Uploading to cloud...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {/* Print Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Number of Copies</label>
              <input
                type="number" name="copies" value={formData.copies} onChange={handleInputChange} min="1"
                className="w-full rounded-xl bg-black border border-neutral-800 text-white px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Print Type</label>
              <select name="printType" value={formData.printType} onChange={handleInputChange}
                className="w-full rounded-xl bg-black border border-neutral-800 text-white px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all appearance-none">
                <option>Black & White</option>
                <option>Color</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Paper Size</label>
              <select name="paperSize" value={formData.paperSize} onChange={handleInputChange}
                className="w-full rounded-xl bg-black border border-neutral-800 text-white px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all appearance-none">
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Binding</label>
              <select name="bindingType" value={formData.bindingType} onChange={handleInputChange}
                className="w-full rounded-xl bg-black border border-neutral-800 text-white px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all appearance-none">
                <option value="none">No Binding</option>
                <option value="spiral">Spiral Binding</option>
                <option value="staple">Staple</option>
              </select>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Your Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ali Khan"
                  className="w-full rounded-xl bg-black border border-neutral-800 text-white px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600" />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-xl bg-black border border-neutral-800 text-white px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Additional Notes (Optional)</label>
              <textarea rows={3} name="notes" value={formData.notes} onChange={handleInputChange} placeholder="e.g. double-sided, specific pages only..."
                className="w-full rounded-xl bg-black border border-neutral-800 text-white px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600 resize-none" />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl text-center mb-6">
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex justify-center items-center gap-3 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <><div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Uploading & Submitting...</>
            ) : (
              <><Printer size={20} /> Submit Print Request</>
            )}
          </button>

          <p className="py-4 px-5 text-sm bg-neutral-800/50 border border-neutral-800 text-neutral-400 mt-6 rounded-xl text-center">
            <span className='font-bold text-amber-500'>Note:</span> You can also visit our shop directly with a USB drive or documents for immediate printing.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrintForm;