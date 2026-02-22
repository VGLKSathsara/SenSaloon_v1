import React, { useContext, useEffect, useState } from 'react'
import { StylistContext } from '../../context/StylistContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

/**
 * StylistProfile Component (Stylist Panel)
 * Displays and manages stylist profile information
 * Allows editing of fees, address, about section, and availability
 */
const StylistProfile = () => {
  const { sToken, profileData, setProfileData, getProfileData } =
    useContext(StylistContext)
  const { currency, backendUrl } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)

  /**
   * Update stylist profile data via API
   * Sends updated fees, address, and availability to backend
   */
  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      }

      const { data } = await axios.post(
        backendUrl + '/api/stylist/update-profile',
        updateData,
        { headers: { sToken } },
      )

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData() // Refresh profile data
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Fetch profile data when stylist token is available
  useEffect(() => {
    if (sToken) {
      getProfileData()
    }
  }, [sToken])

  return (
    profileData && (
      <div className="flex flex-col gap-4 m-5">
        {/* Profile Image Section */}
        <div>
          <img
            className="bg-primary/80 w-full sm:max-w-64 rounded-lg object-cover"
            src={profileData.image}
            alt={profileData.name}
          />
        </div>

        {/* Profile Details Section */}
        <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white shadow-sm">
          {/* Stylist Name */}
          <p className="text-3xl font-medium text-gray-700">
            {profileData.name}
          </p>

          {/* Qualification and Service Type */}
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>
              {profileData.qualification} - {profileData.serviceType}
            </p>
            <button className="py-0.5 px-3 border text-xs rounded-full bg-gray-50">
              {profileData.experience}
            </button>
          </div>

          {/* About Section - Editable in edit mode */}
          <div className="mt-6">
            <p className="text-sm font-medium text-[#262626]">About :</p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1 leading-relaxed">
              {isEdit ? (
                <textarea
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      about: e.target.value,
                    }))
                  }
                  className="w-full outline-primary p-2 border rounded"
                  rows={6}
                  value={profileData.about}
                />
              ) : (
                profileData.about
              )}
            </p>
          </div>

          {/* Service Fee - Editable in edit mode */}
          <p className="text-gray-600 font-medium mt-6">
            Service fee:{' '}
            <span className="text-gray-800 font-semibold">
              {currency}{' '}
              {isEdit ? (
                <input
                  type="number"
                  className="border rounded px-2 w-24 outline-none focus:border-primary"
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      fees: e.target.value,
                    }))
                  }
                  value={profileData.fees}
                />
              ) : (
                profileData.fees
              )}
            </span>
          </p>

          {/* Address Section - Editable in edit mode */}
          <div className="flex gap-2 py-4">
            <p className="font-medium text-gray-600">Address:</p>
            <p className="text-sm text-gray-700">
              {isEdit ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 outline-none focus:border-primary"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={profileData.address.line1}
                  />
                  <input
                    type="text"
                    className="border rounded px-2 py-1 outline-none focus:border-primary"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={profileData.address.line2}
                  />
                </div>
              ) : (
                <>
                  {profileData.address.line1}
                  <br />
                  {profileData.address.line2}
                </>
              )}
            </p>
          </div>

          {/* Availability Toggle - Editable only in edit mode */}
          <div className="flex items-center gap-2 pt-2">
            <input
              id="available-check"
              className="w-4 h-4 accent-primary cursor-pointer"
              type="checkbox"
              onChange={() =>
                isEdit &&
                setProfileData((prev) => ({
                  ...prev,
                  available: !prev.available,
                }))
              }
              checked={profileData.available}
            />
            <label
              htmlFor="available-check"
              className="cursor-pointer text-gray-600 select-none"
            >
              Available for Bookings
            </label>
          </div>

          {/* Edit/Save Button */}
          <div className="mt-8">
            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-8 py-2 bg-primary text-white text-sm rounded-full hover:bg-opacity-90 transition-all shadow-md"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-8 py-2 border border-primary text-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    )
  )
}

export default StylistProfile
