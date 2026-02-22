import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedStylists from '../components/RelatedStylists'
import axios from 'axios'
import { toast } from 'react-toastify'

/**
 * Appointment Component
 * Displays stylist details and available time slots for booking
 */
const Appointment = () => {
  const { stylId } = useParams()
  const { stylists, currencySymbol, backendUrl, token, getStylistsData } =
    useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [stylInfo, setStylInfo] = useState(null)
  const [stylSlots, setStylSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  /**
   * Fetch stylist information from stylists list using stylId
   */
  const fetchStylInfo = async () => {
    setLoading(true)
    const stylInfo = stylists.find((styl) => styl._id === stylId)
    setStylInfo(stylInfo || null)
    setLoading(false)
  }

  /**
   * Generate available time slots for the next 7 days
   * Salon hours: 10:00 AM to 9:00 PM, 30-minute intervals
   * Excludes already booked slots from stylist's slots_booked data
   */
  const getAvailableSlots = async () => {
    if (!stylInfo) return

    setStylSlots([])
    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0) // Salon closes at 9:00 PM

      // Set start time based on whether it's today or future date
      if (today.getDate() === currentDate.getDate()) {
        // For today: start from next hour or 10:00 AM
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10,
        )
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        // For future dates: start from 10:00 AM
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      // Generate 30-minute slots until closing time
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day + '_' + month + '_' + year
        const slotTime = formattedTime

        // Check if slot is already booked
        const isSlotAvailable =
          stylInfo.slots_booked &&
          stylInfo.slots_booked[slotDate] &&
          stylInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      setStylSlots((prev) => [...prev, timeSlots])
    }
  }

  /**
   * Book appointment with selected stylist, date, and time
   * Redirects to login if user is not authenticated
   */
  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Login to book appointment')
      return navigate('/login')
    }

    if (!stylInfo) {
      toast.error('Stylist information not available')
      return
    }

    const date = stylSlots[slotIndex][0].datetime
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    const slotDate = day + '_' + month + '_' + year

    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { stylId, slotDate, slotTime },
        { headers: { token } },
      )
      if (data.success) {
        toast.success(data.message)
        getStylistsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // Fetch stylist info when stylists data or stylId changes
  useEffect(() => {
    if (stylists.length > 0) {
      fetchStylInfo()
    }
  }, [stylists, stylId])

  // Generate available slots when stylist info is loaded
  useEffect(() => {
    if (stylInfo) {
      getAvailableSlots()
    }
  }, [stylInfo])

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  // Show error message if stylist not found
  if (!stylInfo) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Stylist not found</p>
          <button
            onClick={() => navigate('/stylists')}
            className="bg-primary text-white px-6 py-2 rounded-full"
          >
            Browse Stylists
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Stylist Details Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Stylist Image */}
        <div>
          <img
            className="bg-primary w-full sm:max-w-72 rounded-lg"
            src={stylInfo.image}
            alt={stylInfo.name}
          />
        </div>

        {/* Stylist Information */}
        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          {/* Name with verified badge */}
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {stylInfo.name}{' '}
            <img className="w-5" src={assets.verified_icon} alt="verified" />
          </p>

          {/* Service type and experience */}
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>{stylInfo.serviceType} - Expert</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {stylInfo.experience}
            </button>
          </div>

          {/* About section */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
              About <img className="w-3" src={assets.info_icon} alt="info" />
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              {stylInfo.about}
            </p>
          </div>

          {/* Service fee */}
          <p className="text-gray-600 font-medium mt-4">
            Service fee:{' '}
            <span className="text-gray-800">
              {currencySymbol}
              {stylInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* Booking Slots Section */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
        <p>Available Slots</p>

        {/* Date selection - 7 days */}
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {stylSlots.length > 0 &&
            stylSlots.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                key={index}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index
                    ? 'bg-primary text-white'
                    : 'border border-[#DDDDDD]'
                }`}
              >
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))}
        </div>

        {/* Time slots for selected date */}
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {stylSlots.length > 0 &&
            stylSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                key={index}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime
                    ? 'bg-primary text-white'
                    : 'text-[#949494] border border-[#B4B4B4]'
                }`}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>

        {/* Book button */}
        <button
          onClick={bookAppointment}
          className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6"
        >
          Book an appointment
        </button>
      </div>

      {/* Related stylists section */}
      <RelatedStylists serviceType={stylInfo.serviceType} stylId={stylId} />
    </div>
  )
}

export default Appointment
