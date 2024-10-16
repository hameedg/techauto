import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { CalendarIcon, CameraIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function VehicleServiceForm() {
  const [signature, setSignature] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null); // State to store the uploaded image
  const signatureRef = useRef();
  const formRef = useRef(null);

  const clearSignature = () => {
    signatureRef.current.clear();
    setSignature('');
  };

  const saveSignature = () => {
    setSignature(signatureRef.current.toDataURL());
  };

  const downloadPDF = () => {
    const input = formRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('vehicle_service_report.pdf');
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result); // Store the image in state
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12" ref={formRef}>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <img src="/assets/logo.jpeg" alt="Company Logo" width={100} height={50} className='rounded-lg' />
              <button
                onClick={downloadPDF}
                className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Download
              </button>
            </div>

            <form className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Job Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="jobNo" className="block text-sm font-medium text-gray-700">Job No</label>
                    <input
                      type="text"
                      id="jobNo"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="jobDate" className="block text-sm font-medium text-gray-700">Job Date</label>
                    <div className="mt-1 relative rounded-md shadow-sm border">
                      <input
                        type="date"
                        id="jobDate"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                    <input
                      type="number"
                      id="year"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="dateTimeIn" className="block text-sm font-medium text-gray-700">Date/Time In</label>
                    <input
                      type="datetime-local"
                      id="dateTimeIn"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="dateTimeOut" className="block text-sm font-medium text-gray-700">Date/Time Out</label>
                    <input
                      type="datetime-local"
                      id="dateTimeOut"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Vehicle Body Report</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                  <CameraIcon className="h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Upload vehicle image</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2"
                    onChange={handleImageUpload}
                  />
                </div>

                {/* Show uploaded image */}
                {uploadedImage && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-700">Uploaded Image:</h3>
                    <img
                      src={uploadedImage}
                      alt="Uploaded Vehicle"
                      className="w-full h-auto border border-gray-300 rounded-lg mt-2"
                      style={{ maxHeight: '300px', objectFit: 'cover' }} // Landscape format with proper scaling
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Signature</h2>
                <SignatureCanvas
                  ref={signatureRef}
                  penColor="black"
                  canvasProps={{ width: 300, height: 100, className: 'border' }}
                />
                <div className="flex justify-between">
                  <button
                    onClick={clearSignature}
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Clear
                  </button>
                  <button
                    onClick={saveSignature}
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
