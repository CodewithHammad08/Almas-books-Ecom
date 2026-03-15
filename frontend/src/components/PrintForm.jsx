import React, { useState, useRef } from 'react'
import { Upload, X, FileText, Printer } from 'lucide-react';
import api from '../api/axios';

const PrintForm = () => {
  const [formData, setFormData] = useState({
    copies: 1,
    printType: 'Black & White',
    name: '',
    phone: '',
    notes: ''
  });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file to print");
      return;
    }
    if (!formData.name || !formData.phone) {
      setError("Name and Phone number are required");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const formPayload = new FormData();
      formPayload.append('document', file);
      formPayload.append('copies', formData.copies);
      formPayload.append('printType', formData.printType);
      formPayload.append('name', formData.name);
      formPayload.append('phone', formData.phone);
      formPayload.append('notes', formData.notes);

      await api.post('/print-request', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Print request submitted successfully!");
      setFile(null);
      setFormData({ copies: 1, printType: 'Black & White', name: '', phone: '', notes: '' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit print request.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
        Upload files (PDF, DOC, DOCX) and submit a print request.
      </p>
    </div>

    {/* Upload Box */}
    <div 
      onClick={handleUploadClick}
      className={`border-2 border-dashed rounded-2xl p-10 text-center mb-8 cursor-pointer transition-all group ${file ? 'border-green-500 bg-green-500/5' : 'border-neutral-700 hover:border-amber-500 hover:bg-neutral-800'}`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.doc,.docx,.jpg,.png"
      />
      
      {file ? (
        <div className="flex flex-col items-center">
          <div className="bg-neutral-800 p-4 rounded-full shadow-sm mb-4 relative">
             <FileText size={32} className="text-green-500" />
             <button onClick={removeFile} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors">
               <X size={14} />
             </button>
          </div>
          <p className="font-bold text-white text-lg">{file.name}</p>
          <p className="text-sm text-green-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col text-neutral-500 mb-4 items-center group-hover:text-amber-500 transition-colors">
            <Upload size={48} strokeWidth={1.5} />
          </div>
          <p className="font-bold text-white text-lg mb-1">Click to upload or drag and drop</p>
          <p className="text-sm text-neutral-500">Maximum file size: 50MB</p>
        </>
      )}
    </div>

    {/* Options */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-bold text-neutral-400 mb-2">
          Number of Copies
        </label>
        <input
          type="number"
          name="copies"
          value={formData.copies}
          onChange={handleInputChange}
          min="1"
          className="w-full rounded-xl bg-black border border-neutral-800 text-white px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-neutral-400 mb-2">
          Print Type
        </label>
        <select 
          name="printType"
          value={formData.printType}
          onChange={handleInputChange}
          className="w-full rounded-xl bg-black border border-neutral-800 text-white px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all appearance-none"
        >
          <option>Black & White</option>
          <option>Color</option>
        </select>
      </div>
    </div>

    {/* User Info */}
    <div className="space-y-6 mb-8">
      <div>
        <label className="block text-sm font-bold text-neutral-400 mb-2">
          Your Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="John Doe"
          className="w-full rounded-xl bg-black border border-neutral-800 text-white px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-neutral-400 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+91 XXXXX XXXXX"
          className="w-full rounded-xl bg-black border border-neutral-800 text-white px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-neutral-400 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          rows={3}
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Any special instructions..."
          className="w-full rounded-xl bg-black border border-neutral-800 text-white px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600"
        />
      </div>
    </div>

    {/* Error Message */}
    {error && (
      <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center mb-6">
        {error}
      </div>
    )}

    {/* Submit */}
    <button 
      onClick={handleSubmit} 
      disabled={isLoading}
      className={`w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transform ${!isLoading && 'active:scale-[0.98]'} transition-all flex justify-center items-center gap-3 text-lg disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      <Printer size={20} />{isLoading ? 'Submitting Request...' : 'Submit Print Request'}
    </button>

    {/* Footer Note */}
    <p className="py-4 px-5 text-sm bg-neutral-800/50 border border-neutral-800 text-neutral-400 mt-6 rounded-xl text-center">
      <span className='font-bold text-amber-500'>Note:</span> You can also visit our shop directly with a USB drive or documents for immediate printing.
    </p>

  </div>
</section>

    </div>
  )
}

export default PrintForm