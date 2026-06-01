import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddStylist = () => {
  const [stylistImg, setStylistImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')

  const [serviceType, setServiceType] = useState('Hair Cut')
  const [qualifications, setQualifications] = useState([{ id: 1, value: '' }])
  const [nextQualId, setNextQualId] = useState(2)

  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const { backendUrl } = useContext(AppContext)
  const { aToken } = useContext(AdminContext)

  const addQualificationField = () => {
    if (qualifications.length < 3) {
      setQualifications([
        ...qualifications,
        { id: nextQualId, value: '' },
      ])
      setNextQualId(nextQualId + 1)
    } else {
      toast.error('Maximum 3 qualifications allowed')
    }
  }

  const removeQualificationField = (id) => {
    if (qualifications.length > 1) {
      setQualifications(qualifications.filter((q) => q.id !== id))
    } else {
      toast.error('At least one qualification is required')
    }
  }

  const updateQualificationField = (id, value) => {
    setQualifications(
      qualifications.map((q) =>
        q.id === id ? { ...q, value } : q
      )
    )
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (!stylistImg) {
        return toast.error('Image Not Selected')
      }

      if (qualifications.some((q) => q.value.trim() === '')) {
        return toast.error('Please fill all qualification fields')
      }

      const formData = new FormData()

      formData.append('image', stylistImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('serviceType', serviceType)
      formData.append(
        'qualifications',
        JSON.stringify(qualifications.map((q) => q.value))
      )
      formData.append(
        'address',
        JSON.stringify({ line1: address1, line2: address2 })
      )

      const { data } = await axios.post(
        backendUrl + '/api/admin/add-stylist',
        formData,
        { headers: { atoken: aToken } },
      )

      if (data.success) {
        toast.success(data.message)
        setStylistImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setQualifications([{ id: 1, value: '' }])
        setNextQualId(2)
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
              <p>Service Type</p>
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
                <option value="Hair Massage">Hair Massage</option>
              </select>
            </div>

            {/* Qualifications field with dynamic add/remove */}
            <div className="flex-1 flex flex-col gap-1">
              <p>Qualifications</p>
              <div className="space-y-2">
                {qualifications.map((qual, index) => (
                  <div key={qual.id} className="flex gap-2 items-end">
                    <input
                      onChange={(e) =>
                        updateQualificationField(qual.id, e.target.value)
                      }
                      value={qual.value}
                      className="flex-1 border rounded px-3 py-2 focus:border-primary outline-none"
                      type="text"
                      placeholder="Qualification"
                      required
                    />
                    {qualifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQualificationField(qual.id)}
                        className="px-2 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-all"
                        title="Remove qualification"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addQualificationField}
                  disabled={qualifications.length >= 3}
                  className="mt-2 px-4 py-2 bg-blue-50 text-primary border border-primary rounded hover:bg-primary hover:text-white transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-50 disabled:hover:text-primary"
                >
                  + Add Qualification (Max 3)
                </button>
              </div>
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
