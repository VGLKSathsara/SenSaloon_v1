// Import all images
import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chat_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import upload_area from './upload_area.png'
import avatar_icon from './avatar_icon.png'

// Import service icons
import Hair_Cut from './Hair_Curl.svg'
import Facial from './Facial_svg'
import Manicure from './Manicure.svg'
import Hair_Color from './Hair_Color.svg'
import Bridal_Makeup from './Briald_Makeup.svg'
import Hair_Spa from './Hair_Spa.svg'

// PayHere logo - you have the file payhere-logo.png.png (note the double .png)
// Rename your file to payhere-logo.png or use the current name
import payhere_logo from './payhere-logo.png.png'

// Export all assets as an object
export const assets = {
  appointment_img,
  header_img,
  group_profiles,
  logo,
  chats_icon,
  verified_icon,
  info_icon,
  arrow_icon,
  contact_image,
  about_image,
  menu_icon,
  cross_icon,
  dropdown_icon,
  upload_icon,
  upload_area,
  stripe_logo,
  razorpay_logo,
  avatar_icon,
  payhere_logo,
}

// Export service data for the speciality menu
export const serviceData = [
  {
    service: 'Haircut',
    image: Hair_Cut,
  },
  {
    service: 'Facial',
    image: Facial,
  },
  {
    service: 'Manicure',
    image: Manicure,
  },
  {
    service: 'Hair Coloring',
    image: Hair_Color,
  },
  {
    service: 'Makeup',
    image: Bridal_Makeup,
  },
  {
    service: 'Hair Spa',
    image: Hair_Spa,
  },
]

// Export payhere_logo separately if needed
export { payhere_logo }
