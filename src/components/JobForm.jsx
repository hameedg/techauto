import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { CalendarIcon, CameraIcon, ArrowDownTrayIcon,XMarkIcon  } from '@heroicons/react/24/solid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function VehicleServiceForm() {
  const [signature, setSignature] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null); // State to store the uploaded image
  const signatureRef = useRef();
  const formRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [otherValue, setOtherValue] = useState('');
  const [vinNo, setVinNo] = useState('');
  const [data, setData] = useState([{ description: '', labour: '' }]);

  const handleChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  const addRow = () => {
    setData([...data, { description: '', labour: '' }]);
  };

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
      pdf.save(vinNo + '.pdf');
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

  const removeUploadedImage = () => {
    setUploadedImage(null); // Clear the uploaded image
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12" ref={formRef}>
      <div className="container mx-auto max-w-5xl px-4">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <img src="/assets/logo.jpeg" alt="Company Logo" width={100} height={50} className="rounded-lg" />
            <button
              onClick={downloadPDF}
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Download
            </button>
          </div>

          <form className="space-y-8">
            {/* Job Details Section */}
            <h2 className="text-2xl font-bold">Job Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="jobNo" className="block text-sm font-medium text-gray-700">Job No</label>
                <input
                  type="text"
                  id="jobNo"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="jobDate" className="block text-sm font-medium text-gray-700">Job Date</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="date"
                    id="jobDate"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {/* <CalendarIcon className="h-5 w-5 text-gray-400" /> */}
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="number"
                  id="year"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="dateTimeIn" className="block text-sm font-medium text-gray-700">Date/Time In</label>
                <input
                  type="datetime-local"
                  id="dateTimeIn"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="dateTimeOut" className="block text-sm font-medium text-gray-700">Date/Time Out</label>
                <input
                  type="datetime-local"
                  id="dateTimeOut"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Customer Details Section */}
            <h2 className="text-2xl font-bold">Customer Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  id="customerName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="customerContact" className="block text-sm font-medium text-gray-700">Customer Contact No.</label>
                <input
                  type="text"
                  id="customerContact"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* About Car Section */}
            <h2 className="text-2xl font-bold">Car Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">Mileage</label>
                <input
                  type="text"
                  id="mileage"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="carMake" className="block text-sm font-medium text-gray-700">Car Make</label>
                <input
                  type="text"
                  id="carMake"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">Car Model</label>
                <input
                  type="text"
                  id="carModel"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="carReg" className="block text-sm font-medium text-gray-700">Car Registration</label>
                <input
                  type="text"
                  id="carReg"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="engineNo" className="block text-sm font-medium text-gray-700">Engine No</label>
                <input
                  type="text"
                  id="engineNo"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
      <label htmlFor="vinNo" className="block text-sm font-medium text-gray-700">VIN No</label>
      <input
        type="text"
        id="vinNo"
        value={vinNo}
        onChange={(e) => setVinNo(e.target.value)} // Update state on input change
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
            </div>

            <h2 className="text-2xl font-bold">Vehicle Body Report</h2>
            <div className="space-y-4">
            <img src="/assets/techauto_carimage.png" alt="Uploaded Vehicle" className="mt-2 rounded-lg shadow-lg" />

              {!uploadedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                  <CameraIcon className="h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Upload vehicle image</p>
                  <input
                    type="file"
                    className="mt-4"
                    onChange={handleImageUpload}
                  />
                </div>
              ) : (
                <div className="relative mt-4">
                  {/* Show the uploaded image with cross icon */}
                  <h3 className="text-lg font-medium">Uploaded Image:</h3>
                  <img src={uploadedImage} alt="Uploaded Vehicle" className="mt-2 rounded-lg shadow-lg" />
                  {/* Cross icon to remove the image */}
                  <button
                    type="button"
                    onClick={removeUploadedImage}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>

            {/* Report Details Section */}
            <h2 className="text-2xl font-bold">Report Details</h2>
            <div className="grid grid-cols-2 gap-4">
  <div>
    <label htmlFor="reportDefect" className="block text-sm font-medium text-gray-700">Report Defect</label>
    <textarea
      id="reportDefect"
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    ></textarea>
  </div>
  <div>
    <label htmlFor="completedAction" className="block text-sm font-medium text-gray-700">Completed Action</label>
    <textarea
      id="completedAction"
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    ></textarea>
  </div>
  <div className="col-span-2"> {/* Corrected class */}
    <label htmlFor="completedAction2" className="block text-sm font-medium text-gray-700">Vehicle Body Report</label>
    <textarea
      id="completedAction2"
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    ></textarea>
  </div>
</div>

<div className="w-full max-w-xs mx-auto mt-8">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dropdown">
        Select a device
      </label>
      <select
        id="dropdown"
        value={selectedOption}
        onChange={handleSelectChange}
        className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      >
        <option value="">Select an option</option>
        <option value="dash_cam">Dash Cam</option>
        <option value="reversing_camera">Reversing Camera</option>
        <option value="stereo">Stereo</option>
        <option value="other">Other</option>
      </select>

      {selectedOption === 'other' && (
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otherInput">
            Please specify:
          </label>
          <input
            id="otherInput"
            type="text"
            value={otherValue}
            onChange={(e) => setOtherValue(e.target.value)}
            className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            placeholder="Enter your option"
          />
        </div>
      )}
    </div>
  
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-xl shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-left">
            <th className="py-2 px-4 border-b">Part Description</th>
            <th className="py-2 px-4 border-b">Labour</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition duration-150">
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  className="border border-gray-300 rounded w-full p-1"
                  placeholder="Enter part description"
                />
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  value={item.labour}
                  onChange={(e) => handleChange(index, 'labour', e.target.value)}
                  className="border border-gray-300 rounded w-full p-1"
                  placeholder="Enter labour"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="max-w-md mx-auto py-4">
  <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
  <div className="flex items-center justify-center md:justify-start">
      <button
        onClick={addRow}
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-150"
      >
        Add New Row
      </button>
    </div>
    <div className="py-2 px-4">
      <label htmlFor="carReg" className="block text-sm font-medium text-gray-700">Total</label>
      <input
        type="text"
        id="carReg"
        className="mt-1 block w-full border border-gray-300 py-2 px-3 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter total"
      />
    </div>
    

  </div>
</div>

    </div>
            

            {/* Signature Section */}
            <h2 className="text-2xl font-bold">Signature</h2>
            <div className="space-y-4">
              <div className="border-2 border-gray-300 p-6 rounded-lg flex justify-center items-center flex-col">
                <SignatureCanvas
                  penColor="black"
                  ref={signatureRef}
                  canvasProps={{
                    width: 200,
                    height: 200,
                    className: 'signature-canvas border-2 border-gray-300',
                  }}
                />
               
                <div className="flex space-x-4 mt-4">
                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={clearSignature}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                    onClick={saveSignature}
                  >
                    Save Signature
                  </button>
                </div>
                <div>
                <label htmlFor="jobNo" className="block text-sm font-medium text-gray-700">Technician Name</label>
                <input
                  type="text"
                  id="jobNo"
                  className="mt-1 block w-full border-gray-300 border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              </div>

              {signature && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium">Saved Signature:</h3>
                  <img src={signature} alt="Saved Signature" className="mt-2 rounded-lg shadow-lg" />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
