import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

/**
 * AddStylist Component
 * Admin form for creating new stylist accounts
 * Handles image upload, form validation, and API submission
 */
const AddStylist = () => {
  const [stylistImg, setStylistImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')

  // Service type and qualification fields (match backend field names)
  const [serviceType, setServiceType] = useState('Hair Cut')
  const [qualification, setQualification] = useState('')

  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const { backendUrl } = useContext(AppContext)
  const { aToken } = useContext(AdminContext)

  /**
   * Handle form submission
   * Creates FormData object and sends to backend API
   * Resets form on successful submission
   */
  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      // Validate image selection
      if (!stylistImg) {
        return toast.error('Image Not Selected')
      }

      const formData = new FormData()

      // Append all form fields to FormData
      formData.append('image', stylistImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('serviceType', serviceType) // Matches backend field name
      formData.append('qualification', qualification) // Matches backend field name
      formData.append(
        'address',
        JSON.stringify({ line1: address1, line2: address2 }),
      )

      // Send POST request to add stylist
      const { data } = await axios.post(
        backendUrl + '/api/admin/add-stylist',
        formData,
        { headers: { aToken } },
      )

      if (data.success) {
        toast.success(data.message)
        // Reset form fields after successful submission
        setStylistImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setQualification('')
        setAbout('')
        setFees('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium text-gray-700">Add Stylist</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll shadow-sm">
        {/* Image Upload Section */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="stylist-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer object-cover h-16"
              src={
                stylistImg
                  ? URL.createObjectURL(stylistImg)
                  : assets.upload_area
              }
              alt="Upload"
            />
          </label>
          <input
            onChange={(e) => setStylistImg(e.target.files[0])}
            type="file"
            id="stylist-img"
            hidden
          />
          <p className="text-sm">
            Upload Stylist <br /> picture
          </p>
        </div>

        {/* Two-column form layout */}
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* Left Column - Personal Info */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            {/* Name field */}
            <div className="flex-1 flex flex-col gap-1">
              <p>Stylist Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2 focus:border-primary outline-none"
                type="text"
                placeholder="Name"
                required
              />
            </div>

            {/* Email field */}
            <div className="flex-1 flex flex-col gap-1">
              <p>Stylist Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2 focus:border-primary outline-none"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            {/* Password field */}
            <div className="flex-1 flex flex-col gap-1">
              <p>Set Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2 focus:border-primary outline-none"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            {/* Experience dropdown */}
            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border rounded px-2 py-2 focus:border-primary outline-none"
              >
                {[...Array(10).keys()].map((i) => (
                  <option key={i} value={`${i + 1} Year`}>
                    {i + 1} Year{i > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Service fees field */}
            <div className="flex-1 flex flex-col gap-1">
              <p>Service Fees (LKR)</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border rounded px-3 py-2 focus:border-primary outline-none"
                type="number"
                placeholder="Fees"
                required
              />
            </div>
          </div>

          {/* Right Column - Professional Info */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            {/* Service type dropdown */}
            <div className="flex-1 flex flex-col gap-1">
              <p>Service Type (Speciality)</p>
              <select
                onChange={(e) => setServiceType(e.target.value)}
                value={serviceType}
                className="border rounded px-2 py-2 focus:border-primary outline-none"
              >
                <option value="Hair Cut">Hair Cut</option>
                <option value="Facial">Facial</option>
                <option value="Hair Color">Hair Color</option>
                <option value="Bridal Dressing">Bridal Dressing</option>
                <option value="Manicure/Pedicure">Manicure/Pedicure</option>
                <option value="Body Massage">Body Massage</option>
              </select>
            </div>

            {/* Qualification field */}
            <div className="flex-1 flex flex-col gap-1">
              <p>Qualification</p>
              <input
                onChange={(e) => setQualification(e.target.value)}
                value={qualification}
                className="border rounded px-3 py-2 focus:border-primary outline-none"
                type="text"
                placeholder="Qualification"
                required
              />
            </div>

            {/* Address fields */}
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2 mb-2 focus:border-primary outline-none"
                type="text"
                placeholder="Address 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2 focus:border-primary outline-none"
                type="text"
                placeholder="Address 2"
                required
              />
            </div>
          </div>
        </div>

        {/* About section - full width */}
        <div className="mt-4">
          <p className="mb-2">About Stylist</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded focus:border-primary outline-none"
            rows={5}
            placeholder="Write about stylist"
            required
          ></textarea>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-6 text-white rounded-full hover:bg-opacity-90 transition-all shadow-md"
        >
          Add Stylist
        </button>
      </div>
    </form>
  )
}

export default AddStylist
