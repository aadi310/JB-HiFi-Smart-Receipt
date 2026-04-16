"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronRight,
  Flame,
  Download,
  ExternalLink,
  FileText,
  History,
  Instagram,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Star,
  User2,
  ThumbsUp,
  Share2,
  Facebook,
  Sparkles,
  ShieldCheck, PlugZap, Headphones, Wrench, 
  Truck, Package, CheckCircle2, RotateCcw, Repeat, AlertCircle,
  MapPin,
  ShoppingBagIcon,
  Smartphone,
  Receipt as ReceiptIcon,
} from "lucide-react"

interface Receipt {
  id: string
  date: string
  time: string
  associate: string
  branch: string
  items: Array<{
    id: number
    name: string
    description: string
    price: number
    quantity: number
    category?: string
    taxApplicable?: boolean
    baseAmount?: number
    tax?: number
    itemCode?: string
    variant?: string
    serialNumber?: string
    warranty?: string

    installationAvailable?: boolean
    installationStatus?: string
    installationScheduledDate?: string
  }>
  subtotal: number
  tax: number
  total: number
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showTerms, setShowTerms] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [expandedProducts, setExpandedProducts] = useState<number[]>([])
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: string[] }>({})
  const [currentReceiptId, setCurrentReceiptId] = useState("current")
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [showReferModal, setShowReferModal] = useState(false)
  const [showStoreLocation, setShowStoreLocation] = useState(false)
  const receiptContainerRef = useRef<HTMLDivElement>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [couponToast, setCouponToast] = useState<string | null>(null)
  const [itemFeedback, setItemFeedback] = useState({})
  const [expandedItemFeedback, setExpandedItemFeedback] = useState([])
  const [showReturnPanel, setShowReturnPanel] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [returnType, setReturnType] = useState<"return" | "exchange" | null>(null)
  const [returnReason, setReturnReason] = useState("")
  const [returnComment, setReturnComment] = useState("")
  const [refundMethod, setRefundMethod] = useState("original")
  const [returnSubmitted, setReturnSubmitted] = useState(false)
  const [returnRequestId, setReturnRequestId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState({
    service: 0,
    quality: 0,
    style: 0,
    pricing: 0,
    store: 0,
    comments: "",
  })
  const [profile, setProfile] = useState({
    mobile: "",
    name: "",
    email: "",
    gender: "",
  })
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")

 const copyCoupon = (code: string) => {
  navigator.clipboard.writeText(code)
  setCouponToast(code)

  setTimeout(() => {
    setCouponToast(null)
  }, 3000)
}

  const toggleItemFeedback = (id) => {
  setExpandedItemFeedback((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
  )
}

 const openTataNeu = () => {
  const userAgent = navigator.userAgent || navigator.vendor

  if (/android/i.test(userAgent)) {
    window.open(
      "https://play.google.com/store/apps/details?id=com.tatadigital.tcp",
      "_blank"
    )
  } else if (/iPad|iPhone|iPod/.test(userAgent)) {
    window.open(
      "https://apps.apple.com/in/app/tata-neu-shop-travel-finance/id1584669293",
      "_blank"
    )
  } else {
    window.open("https://www.tataneu.com/", "_blank")
  }
}

  const setItemRating = (itemId, rating) => {
  setItemFeedback((prev) => ({
    ...prev,
    [itemId]: {
      ...prev[itemId],
      rating,
    },
  }))
}

  const toggleItemTag = (itemId, tag) => {
  setItemFeedback((prev) => {
    const currentTags = prev[itemId]?.tags || []

    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag]

    return {
      ...prev,
      [itemId]: {
        ...prev[itemId],
        tags: newTags,
      },
    }
  })
}

  const generateReturnId = () => {
  return "CR" + Math.floor(100000 + Math.random() * 900000)
}

  const customerName = "Madhav"

  // Carousel refs and APIs
  const [promoApi, setPromoApi] = useState<CarouselApi>()
  const feedbackButtonRef = useRef<HTMLButtonElement>(null)
  const historyButtonRef = useRef<HTMLButtonElement>(null)
  const referButtonRef = useRef<HTMLButtonElement>(null)

  // Auto-play effect for promo carousel
  useEffect(() => {
    if (!promoApi) return
    const interval = setInterval(() => {
      promoApi.scrollNext()
    }, 4000)
    return () => clearInterval(interval)
  }, [promoApi])

  useEffect(() => {
  setItemFeedback({})
  setExpandedItemFeedback([])
}, [currentReceiptId])

  // Simple auto-height for WordPress iframe
  useEffect(() => {
    const postHeight = () => {
      const marker = document.getElementById("height-marker")
      if (marker && window.parent) {
        const rect = marker.getBoundingClientRect()
        const newHeight = Math.ceil(rect.top + rect.height + window.scrollY)
        window.parent.postMessage({ frameHeight: newHeight }, "*")
      }
    }

    // Run on load
    postHeight()

    // Observe changes to the DOM
    const ro = new ResizeObserver(postHeight)
    ro.observe(document.body)

    // Re-run on resize
    window.addEventListener("resize", postHeight)

    return () => {
      ro.disconnect()
      window.removeEventListener("resize", postHeight)
    }
  }, [])

  // Update current slide when carousel changes
  useEffect(() => {
    if (!promoApi) return
    promoApi.on("select", () => {
      setCurrentSlide(promoApi.selectedScrollSnap())
    })
  }, [promoApi])

  useEffect(() => {
  setShowReturnPanel(false)
  setSelectedProduct(null)
  setReturnType(null)
  setReturnReason("")
  setReturnComment("")
  setRefundMethod("original")
  setReturnSubmitted(false)
}, [currentReceiptId])

const receipts = {

  current: {
    id: "CRBLR7891XQ12",
    date: "05-03-2026",
    time: "19:22:18",
    associate: "Rahul Kumar",
    branch: "Brigade Road",

    items: [
      {
        id: 0,
        name: "LG 1.5 Ton Dual Inverter Split AC",
        variant: "5 Star 2026 Model",
        description: "AI Convertible 6-in-1 cooling",
        price: 46990,
        quantity: 1,
        category: "Air Conditioners",
        baseAmount: 39822,
        tax: 7168,
        itemCode: "LGAC15INV26",
        serialNumber: "LGAC15X9921",
        warranty: "1 Year Product / 10 Year Compressor",

        installationAvailable: true,
        installationStatus: "Scheduled",
        installationScheduledDate: "07 Mar 2026"
      },

      {
        id: 1,
        name: "Apple AirPods (3rd Generation)",
        variant: "Wireless Charging Case",
        description: "Spatial audio with dynamic head tracking",
        price: 19900,
        quantity: 1,
        category: "Audio",
        baseAmount: 16864,
        tax: 3036,
        itemCode: "AIRPODS3",
        serialNumber: "APD3X77P21",
        warranty: "1 Year Apple Warranty"
      }
    ],

    subtotal: 56686,
    tax: 10204,
    total: 66890
  },


  hist1: {
    id: "CRBLR6719YT92",
    date: "20-01-2026",
    time: "14:22:18",
    associate: "Anita Sharma",
    branch: "Indiranagar",

    items: [
      {
        id: 0,
        name: "Samsung 55\" Crystal 4K UHD Smart TV",
        variant: "CU7700 55 inch",
        description: "Crystal Processor 4K with HDR10+",
        price: 54990,
        quantity: 1,
        category: "Televisions",
        baseAmount: 46517,
        tax: 8473,
        itemCode: "SAM55CU7700",
        serialNumber: "SAMTV55CU7721",
        warranty: "1 Year Samsung Warranty",

        installationAvailable: true,
        installationStatus: "Completed",
        installationScheduledDate: "22 Jan 2026"
      },

      {
        id: 1,
        name: "Amazon Fire TV Stick 4K",
        variant: "4K Streaming",
        description: "Dolby Vision with Alexa Voice Remote",
        price: 5999,
        quantity: 1,
        category: "Streaming Devices",
        baseAmount: 5084,
        tax: 915,
        itemCode: "AMZFTV4K",
        serialNumber: "AMZ4KTV881",
        warranty: "1 Year Warranty"
      }
    ],

    subtotal: 51601,
    tax: 9388,
    total: 60989
  },


  hist2: {
    id: "CRBLR5590LP33",
    date: "15-12-2025",
    time: "12:45:33",
    associate: "Sanjay Reddy",
    branch: "Koramangala",

    items: [
      {
        id: 0,
        name: "Kent RO Water Purifier",
        variant: "Grand Plus RO + UV",
        description: "RO+UV+UF purification with TDS control",
        price: 18990,
        quantity: 1,
        category: "Water Purifiers",
        baseAmount: 16093,
        tax: 2897,
        itemCode: "KENTGRANDPLUS",
        serialNumber: "KENTRO8891",
        warranty: "1 Year Kent Warranty",

        installationAvailable: true,
        installationStatus: "Completed",
        installationScheduledDate: "16 Dec 2025"
      },

      {
        id: 1,
        name: "Logitech MX Master 3S Mouse",
        variant: "Wireless Bluetooth",
        description: "Advanced productivity mouse",
        price: 9995,
        quantity: 1,
        category: "Computer Accessories",
        baseAmount: 8461,
        tax: 1534,
        itemCode: "LOGMXM3S",
        serialNumber: "LOGM3S9901",
        warranty: "1 Year Logitech Warranty"
      }
    ],

    subtotal: 24554,
    tax: 4431,
    total: 28985
  }

};
  
  const currentReceipt = receipts[currentReceiptId]

  const totalSlides = 2

  const transactionHistory = [
    {
      id: "current",
      date: "05-03-2026",
      branch: "Croma",
      amount: currentReceiptId === "current" ? receipts.current.subtotal + receipts.current.tax : 66890.00,
    },
    { id: "hist1", date: "20-01-2026", branch: "Croma", amount: 60989.00 },
    { id: "hist2", date: "15-12-2025", branch: "Croma", amount: 28985.00 },
  ]

  const toggleProductExpansion = (productId: number) => {
    setExpandedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleProfileUpdate = () => {
    setProfileUpdateSuccess(true)
    setTimeout(() => setProfileUpdateSuccess(false), 3000)
  }

  const getModalPositionRelativeToContainer = (buttonRef: React.RefObject<HTMLButtonElement>) => {
    if (!buttonRef.current || !receiptContainerRef.current) {
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
    }

    const button = buttonRef.current
    const container = receiptContainerRef.current

    const buttonRect = button.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    // Calculate position relative to container
    const relativeTop = buttonRect.top - containerRect.top
    const relativeLeft = buttonRect.left - containerRect.left

    // Modal dimensions (approximate)
    const modalWidth = Math.min(400, containerRect.width - 32)
    const modalHeight = 400

    // Calculate ideal top position (above button, with offset)
    let top = Math.max(16, relativeTop - modalHeight - 8)

    // If modal would go off top, place it below button
    if (top < 16) {
      top = relativeTop + buttonRect.height + 8
    }

    // If still too high, center it vertically
    if (top + modalHeight > containerRect.height) {
      top = Math.max(16, (containerRect.height - modalHeight) / 2)
    }

    // Calculate ideal left position (centered on button)
    let left = relativeLeft + buttonRect.width / 2 - modalWidth / 2

    // Keep modal within horizontal bounds
    left = Math.max(16, Math.min(left, containerRect.width - modalWidth - 16))

    return {
      position: "absolute" as const,
      top: `${top}px`,
      left: `${left}px`,
      width: `${modalWidth}px`,
      maxHeight: "85vh",
    }
  }

  const handleFeedbackModalOpen = () => {
    setShowFeedbackModal(true)
  }

  const handleTransactionHistoryOpen = () => {
    setShowTransactionHistory(true)
  }

  const handleReferModalOpen = () => {
    setShowReferModal(true)
  }

  const handleFeedbackSubmit = () => {
    setFeedbackSubmitted(true)
    setShowFeedbackModal(false)
    setTimeout(() => setFeedbackSubmitted(false), 5000)
  }

  const handleShare = () => {
    handleReferModalOpen()
  }

  const handleEmailReceipt = () => {
    window.open(`mailto:?subject=Receipt from Domino's Bangalore&body=Receipt ID: ${currentReceipt.id}`)
  }

  const handleDownloadReceipt = () => {
    const receiptContent = `
  <!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Croma Digital Receipt</title>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
font-family:'Poppins',sans-serif;
font-size:14px;
color:#111;
background:#fff;
width:800px;
margin:0 auto;
padding:24px;
}

/* Header */

.receipt-header{
display:flex;
justify-content:space-between;
align-items:flex-start;
margin-bottom:28px;
padding-bottom:16px;
border-bottom:3px solid #2CBC9C;
}

.company-info h1{
font-size:30px;
color:#2CBC9C;
font-weight:700;
margin-bottom:4px;
}

.company-info p{
font-size:12px;
color:#555;
line-height:1.4;
}

.bill-info{
text-align:right;
font-size:12px;
}

.bill-info div{
margin-bottom:4px;
}

.bill-id{
font-weight:600;
color:#2CBC9C;
}

/* Customer */

.customer-section{
background:#F1FBF8;
padding:14px;
border-left:4px solid #2CBC9C;
border-radius:0 8px 8px 0;
margin-bottom:22px;
}

.customer-section h3{
font-size:15px;
color:#2CBC9C;
font-weight:600;
margin-bottom:2px;
}

.customer-section p{
font-size:12px;
color:#666;
}

/* Table */

.items-table{
width:100%;
border-collapse:collapse;
margin-bottom:24px;
}

.items-table th{
background:#2CBC9C;
color:white;
padding:10px 8px;
text-align:left;
font-size:11px;
text-transform:uppercase;
letter-spacing:0.5px;
}

.items-table td{
padding:12px 8px;
border-bottom:1px solid #eee;
font-size:12px;
vertical-align:top;
}

.item-name{
font-weight:600;
margin-bottom:3px;
}

.item-desc{
font-size:11px;
color:#666;
}

.item-specs{
font-size:10px;
color:#2CBC9C;
margin-top:4px;
font-weight:600;
}

/* Totals */

.totals-section{
display:flex;
justify-content:space-between;
margin-bottom:20px;
}

.items-count{
font-weight:600;
}

.totals-table{
text-align:right;
min-width:200px;
}

.totals-table div{
margin-bottom:6px;
font-size:13px;
}

.net-total{
font-size:18px;
font-weight:700;
color:#2CBC9C;
border-top:2px solid #2CBC9C;
padding-top:6px;
margin-top:6px;
}

/* Footer */

.footer{
text-align:center;
margin-top:30px;
padding-top:20px;
border-top:1px dashed #ccc;
font-size:12px;
color:#555;
}

.footer strong{
color:#2CBC9C;
}

.powered{
margin-top:10px;
font-size:10px;
color:#999;
font-weight:600;
}

@media print{
body{
-webkit-print-color-adjust:exact;
width:100%;
padding:0;
}
}

</style>
</head>

<body>

<div class="receipt-header">

<div class="company-info">
<h1>Croma</h1>
<p>
<strong>Croma Retail Store</strong><br>
Brigade Road<br>
Bengaluru, Karnataka 560001<br>
India
</p>
</div>

<div class="bill-info">
<div><strong>Receipt ID:</strong> <span class="bill-id">CRBLR7891XQ12</span></div>
<div><strong>Date:</strong> 05-03-2026 19:22</div>
<div><strong>Store Associate:</strong> Rahul Kumar</div>
</div>

</div>

<div class="customer-section">
<h3>Customer: ${customerName}</h3>
<p>Thank you for shopping at Croma!</p>
</div>

<table class="items-table">

<thead>
<tr>
<th style="width:50%">Product</th>
<th style="width:10%">Qty</th>
<th style="width:15%">Variant</th>
<th style="width:12%">Price</th>
<th style="width:13%">Total</th>
</tr>
</thead>

<tbody>

<tr>
<td>
<div class="item-name">LG 1.5 Ton Dual Inverter Split AC</div>
<div class="item-desc">AI Convertible 6-in-1 cooling</div>
<div class="item-specs">
Product Code: LGAC15INV26<br>
Serial: LGAC15X9921<br>
Warranty: 1 Year Product / 10 Year Compressor
</div>
</td>
<td>1</td>
<td>5 Star 2026 Model</td>
<td>₹46,990</td>
<td><strong>₹46,990</strong></td>
</tr>

<tr>
<td>
<div class="item-name">Apple AirPods (3rd Generation)</div>
<div class="item-desc">Spatial audio with dynamic head tracking</div>
<div class="item-specs">
Product Code: AIRPODS3<br>
Serial: APD3X77P21<br>
Warranty: 1 Year Apple Warranty
</div>
</td>
<td>1</td>
<td>Wireless Charging Case</td>
<td>₹19,900</td>
<td><strong>₹19,900</strong></td>
</tr>

</tbody>
</table>

<div class="totals-section">

<div class="items-count">
Items Purchased: 2
</div>

<div class="totals-table">
<div>Subtotal: <strong>₹56,686</strong></div>
<div>GST: <strong>₹10,204</strong></div>
<div class="net-total">Total Paid: <strong>₹66,890</strong></div>
</div>

</div>

<div class="footer">

<p><strong>Thank you for shopping with Croma!</strong></p>
<p>Visit www.croma.com for exclusive offers and services.</p>

<div class="powered">
Powered by RDEP
</div>

</div>

</body>
</html>
    `

    const blob = new Blob([receiptContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "Croma_Receipt_SK251107001.html"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleWhatsApp = () => {
    window.open("https://wa.me/+919620921294", "_blank")
  }

  const handleCall = () => {
    window.open("tel:+919620921294", "_blank")
  }

  const handleEmail = () => {
    window.open("mailto:sagar.p@proenx.com", "_blank")
  }

  const handleSocialLink = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div
        id="receipt-root"
        ref={receiptContainerRef}
        className="w-full max-w-md mx-auto bg-white shadow-lg relative overflow-hidden"
      >
        <div className="flex flex-col w-full gap-3 pb-4 px-3">

       {/* Top Section */}
<div className="bg-white rounded-2xl shadow-md border border-gray-200 mt-4 mx-3 overflow-hidden">

  {/* Header */}
  <div className="bg-[#FFF200] px-5 pt-5 pb-6 text-black">

    <div className="flex items-start justify-between">

      {/* Logo */}
      <img
        src="/images/design-mode/jb-hifi-logo.png"
        alt="JB Hi-Fi"
        className="h-10 w-auto"
      />

      {/* QR */}
      <div className="bg-white rounded-xl p-2 shadow-sm">
        <Image
          src="/images/design-mode/800px-QR_code_for_mobile_English_Wikipedia.svg.png"
          alt="QR Code"
          width={52}
          height={52}
        />
      </div>

    </div>


    {/* Greeting */}
    <div className="mt-4">
      <div className="text-lg font-bold">
        Thank you {customerName}
      </div>

      <div className="text-sm text-black/70">
        We hope to see you again soon!
      </div>
    </div>


    {/* Amount Card */}
    <div className="mt-4 bg-black rounded-xl p-4 flex justify-between items-center">

      <div>
        <div className="text-xs text-white/80">
          Total Amount Paid
        </div>

        <div className="text-3xl font-semibold text-[#FFF200]">
          A${currentReceipt.total.toLocaleString("en-AU")}
        </div>
      </div>

      <ShoppingBagIcon className="h-7 w-7 text-[#FFF200]" />

    </div>

  </div>


  {/* Receipt Metadata */}
  <div className="p-4 bg-white">

    <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-3 space-y-2">

      {/* Receipt ID */}
      <div className="flex justify-between items-center">

        <span className="text-xs text-gray-600">
          Receipt ID
        </span>

        <span className="text-sm font-semibold tracking-wide text-right">
          {currentReceipt.id}
        </span>

      </div>


      {/* Date & Time */}
      <div className="flex justify-between items-center">

        <span className="text-xs text-gray-600">
          Date & Time
        </span>

        <span className="text-sm font-semibold text-right">
          {currentReceipt.date} {currentReceipt.time}
        </span>

      </div>


      {/* Store */}
      <div className="flex justify-between items-center">

        <span className="text-xs text-gray-600">
          Store
        </span>

        <span className="text-sm font-semibold text-right">
          JB Hi-Fi {currentReceipt.branch}
        </span>

      </div>

    </div>

  </div>

</div>
          
        {/* Purchase Details */}

<div className="bg-white rounded-2xl shadow-md border border-gray-200 mt-4 mx-3 p-4">

{/* Header */}

<div className="flex items-center justify-between mb-4">

<div className="flex items-center">

<div className="w-8 h-8 bg-[#FFF200] rounded-lg flex items-center justify-center mr-3">
  <ShoppingBagIcon className="h-4 w-4 text-black" />
</div>

<h3 className="text-lg font-bold text-black">
  Purchased Products
</h3>

</div>

<span className="text-xs font-bold bg-[#FFF200] text-black px-2 py-1 rounded-full">
  {currentReceipt.items.length} items
</span>

</div>

{/* Product List */}

<div className="space-y-3">

{currentReceipt.items.map((product) => (

<div
  key={product.id}
  className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#FFF200] transition"
>

{/* Product Row */}

<div
  className="flex items-start justify-between cursor-pointer"
  onClick={() => toggleProductExpansion(product.id)}
>

<div className="flex items-start flex-1">

<ChevronRight
  className={`h-4 w-4 mr-2 mt-[2px] text-[#E31E24] transition-transform duration-200 ${
    expandedProducts.includes(product.id) ? "rotate-90" : ""
  }`}
/>

<div>

<div className="font-semibold text-sm text-gray-900 leading-snug">
  {product.name}
</div>

<div className="text-xs text-gray-500 mt-0.5">
  {product.category}
</div>

</div>

</div>


<div className="text-right ml-2">

<div className="text-xs text-gray-500">
  Qty {product.quantity}
</div>

<div className="font-bold text-sm text-[#E31E24]">
  A${(product.price * product.quantity).toLocaleString("en-AU")}
</div>

</div>

</div>


{/* Expanded Product Details */}

{expandedProducts.includes(product.id) && (

<div className="mt-3 pt-3 border-t border-gray-200 space-y-2 text-xs text-gray-700">

<div>
<div className="text-gray-500">Variant</div>
<div className="font-medium">{product.variant}</div>
</div>

<div>
<div className="text-gray-500">Product Code</div>
<div className="font-medium">{product.itemCode}</div>
</div>

<div>
<div className="text-gray-500">Serial Number</div>
<div className="font-medium">{product.serialNumber}</div>
</div>

<div>
<div className="text-gray-500">Warranty</div>
<div className="font-medium">{product.warranty}</div>
</div>

</div>

)}


{/* Product Feedback Toggle */}

<div className="mt-3">

<button
  onClick={() => toggleItemFeedback(product.id)}
  className="text-xs text-[#E31E24] font-semibold"
>
  {expandedItemFeedback.includes(product.id)
    ? "Hide product feedback"
    : "Rate this product"}
</button>

</div>


{/* Feedback Panel */}

{expandedItemFeedback.includes(product.id) && (

<div className="mt-3 bg-white border border-gray-200 rounded-xl p-3">

<div className="flex justify-center gap-2 mb-3">

{[1,2,3,4,5].map((star) => (

<button
  key={star}
  onClick={() => setItemRating(product.id, star)}
>

<Star
  className={`h-5 w-5 ${
    star <= (itemFeedback[product.id]?.rating || 0)
      ? "fill-[#FFF200] text-[#FFF200]"
      : "text-gray-300"
  }`}
/>

</button>

))}

</div>

</div>

)}

</div>

))}

</div>


{/* Totals */}

<div className="mt-5 pt-4 border-t border-gray-200 space-y-2 text-sm">

<div className="flex justify-between">
<span className="text-gray-600">Subtotal</span>
<span>A${currentReceipt.subtotal.toLocaleString("en-AU")}</span>
</div>

<div className="flex justify-between">
<span className="text-gray-600">GST</span>
<span>A${currentReceipt.tax.toLocaleString("en-AU")}</span>
</div>

<div className="flex justify-between text-base font-bold pt-3 border-t border-gray-200 bg-[#FFF200] px-3 py-2 rounded-lg">
<span>Total Paid</span>
<span>
  A${currentReceipt.total.toLocaleString("en-AU")}
</span>
</div>

</div>


{/* Payment */}

<div className="mt-5">

<div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">

<div className="flex items-center">

<div className="w-8 h-8 bg-[#008A00] rounded-lg flex items-center justify-center mr-3">

<svg
  className="w-4 h-4 text-white"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <rect x="1" y="4" width="22" height="16" rx="2"></rect>
  <line x1="1" y1="10" x2="23" y2="10"></line>
</svg>

</div>

<div>

<div className="text-xs font-medium">
  Card Payment
</div>

<div className="text-xs text-gray-500">
  **** **** **** 4532
</div>

</div>

</div>

<div className="text-sm font-bold text-[#E31E24]">
  A${currentReceipt.total.toLocaleString("en-AU")}
</div>

</div>

</div>

</div>

{/* Delivery Status */}
<div className="bg-white rounded-2xl shadow-md border border-gray-200 mt-4 mx-3 p-4 font-poppins">

  {/* Header */}
  <div className="flex items-center justify-between mb-4">

    <div className="flex items-center">

      <div className="bg-[#FFF200] p-2 rounded-lg mr-3">
        <Truck className="h-4 w-4 text-black" />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900">
          Delivery Status
        </h3>

        <p className="text-[11px] text-gray-500">
          Your order is on the way
        </p>
      </div>

    </div>

    {/* Status Badge */}
    <div className="text-[10px] font-semibold bg-[#FFF200] text-black px-2 py-1 rounded-full">
      In Transit
    </div>

  </div>


  {/* Progress Tracker */}
  <div className="flex items-center justify-between mb-4">

    {/* Confirmed */}
    <div className="flex flex-col items-center text-center flex-1">

      <div className="w-8 h-8 rounded-full bg-[#008A00] text-white flex items-center justify-center">
        <CheckCircle2 className="h-4 w-4"/>
      </div>

      <span className="text-[10px] text-gray-600 mt-1">
        Confirmed
      </span>

    </div>


    <div className="flex-1 h-[3px] bg-[#008A00]"></div>


    {/* In Transit */}
    <div className="flex flex-col items-center text-center flex-1">

      <div className="w-8 h-8 rounded-full border-2 border-[#008A00] text-[#008A00] flex items-center justify-center">
        <Truck className="h-4 w-4"/>
      </div>

      <span className="text-[10px] font-medium text-[#008A00] mt-1">
        In Transit
      </span>

    </div>


    <div className="flex-1 h-[3px] bg-gray-200"></div>


    {/* Delivered */}
    <div className="flex flex-col items-center text-center flex-1">

      <div className="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-300 flex items-center justify-center">
        <MapPin className="h-4 w-4"/>
      </div>

      <span className="text-[10px] text-gray-400 mt-1">
        Delivered
      </span>

    </div>

  </div>


  {/* Delivery Info */}
  <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-3 text-center mb-3">

    <p className="text-[11px] text-gray-600">
      Estimated Delivery
    </p>

    <p className="text-sm font-semibold text-gray-900">
      09 Mar 2026
    </p>

  </div>


  {/* Track Button */}
  <a
    href="https://www.jbhifi.com.au"
    target="_blank"
    rel="noopener noreferrer"
  >
    <button className="w-full bg-[#FFF200] text-black h-10 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition active:scale-[0.98]">

      Track Order

      <ExternalLink className="h-3 w-3"/>

    </button>
  </a>

</div>
          
{/* Feedback Section */}

<div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4 font-poppins">

{feedbackSubmitted ? (

<div className="text-center py-6 bg-yellow-50 rounded-xl border border-yellow-200">

  <div className="w-12 h-12 bg-[#FFF200] rounded-full flex items-center justify-center mx-auto mb-3">

    <svg
      className="w-6 h-6 text-black"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
    </svg>

  </div>

  <div className="text-sm font-semibold text-gray-900 mb-1">
    Thanks for your feedback!
  </div>

  <div className="text-xs text-gray-600">
    Your feedback helps us improve the JB Hi-Fi shopping experience.
  </div>

</div>

) : (

<div className="space-y-4">

{/* Header */}

<div className="flex items-center">

<div className="bg-[#FFF200] p-2 rounded-lg mr-3">
  <Star className="h-4 w-4 text-black" />
</div>

<h3 className="text-base font-semibold text-gray-900">
  Rate Your Shopping Experience
</h3>

</div>


{/* Star Rating */}

<div className="flex justify-center gap-3 py-2">

{[1,2,3,4,5].map((star) => (

<button
  key={star}
  onClick={() => {
    setRating(star)
    setSelectedTags([])
  }}
  className="transition-transform active:scale-90"
>

<Star
  className={`h-8 w-8 ${
    star <= rating
      ? "fill-[#E31E24] text-[#E31E24]"
      : "text-gray-300"
  }`}
/>

</button>

))}

</div>


{/* Dynamic Feedback Tags */}

{rating > 0 && (

<div className="space-y-2">

<div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
  Tell us more
</div>

<div className="flex flex-wrap gap-2">

{(rating >= 4
  ? [
      "Great product quality",
      "Helpful staff",
      "Smooth checkout",
      "Fast billing",
      "Good value",
      "Easy installation",
    ]
  : [
      "Long checkout time",
      "Product not available",
      "Staff assistance needed",
      "Price higher than expected",
      "Installation delay",
      "Packaging issue",
    ]
).map((item) => (

<button
  key={item}
  onClick={() =>
    setSelectedTags((prev) =>
      prev.includes(item)
        ? prev.filter((tag) => tag !== item)
        : [...prev, item]
    )
  }
  className={`text-[11px] px-3 py-1.5 rounded-full border transition ${
    selectedTags.includes(item)
      ? "bg-[#FFF200] text-black border-[#FFF200]"
      : "border-gray-200 bg-gray-50"
  }`}
>
  {item}
</button>

))}

</div>

</div>

)}


{/* Optional Comment */}

<div className="space-y-1">

<label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
  Additional Feedback (Optional)
</label>

<textarea
  rows={3}
  placeholder="Tell us about your JB Hi-Fi shopping experience"
  className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#FFF200] focus:border-[#FFF200] outline-none resize-none"
  value={feedbackText}
  onChange={(e) => setFeedbackText(e.target.value)}
/>

</div>


{/* Submit Button */}

<button
className="w-full bg-[#FFF200] text-black h-10 text-xs font-semibold rounded-xl transition active:scale-[0.98]"
onClick={handleFeedbackSubmit}
disabled={!rating}
>
Submit Feedback
</button>


<p className="text-[10px] text-center text-gray-400">
Your feedback helps us improve future shopping experiences.
</p>

</div>

)}

</div>
          
{/* Promo Banner Carousel */}

<div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden mx-3 mt-4 relative">

<Carousel
className="w-full"
setApi={setPromoApi}
opts={{
loop: true,
}}
>

<CarouselContent>

{/* Banner 1 */}

<CarouselItem>

<a
href="https://www.jbhifi.com.au/pages/upfront-mobile-plans"
target="_blank"
rel="noopener noreferrer"
className="block w-full"
>

<div className="relative w-full aspect-[1650/530]">

<Image
src="/images/design-mode/jb-hifi-banner-1.png"
alt="JB Hi-Fi Mobile Plans"
fill
className="object-cover"
priority
/>

</div>

</a>

</CarouselItem>


{/* Banner 2 */}

<CarouselItem>

<a
href="https://www.jbhifi.com.au/collections/mobile-phones/galaxy-s26-series"
target="_blank"
rel="noopener noreferrer"
className="block w-full"
>

<div className="relative w-full aspect-[1650/530]">

<Image
src="/images/design-mode/jb-hifi-banner-2.png"
alt="Samsung Galaxy S26 Series"
fill
className="object-cover"
/>

</div>

</a>

</CarouselItem>


{/* Banner 3 */}

<CarouselItem>

<a
href="https://www.jbhifi.com.au/collections/tvs/tv-clearance"
target="_blank"
rel="noopener noreferrer"
className="block w-full"
>

<div className="relative w-full aspect-[1650/530]">

<Image
src="/images/design-mode/jb-hifi-banner-3.png"
alt="JB Hi-Fi TV Clearance"
fill
className="object-cover"
/>

</div>

</a>

</CarouselItem>

</CarouselContent>


{/* Pagination Dots */}

<div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">

{[0, 1, 2].map((index) => (

<button
key={index}
onClick={() => promoApi?.scrollTo(index)}
className={`h-1.5 rounded-full transition-all duration-300 ${
currentSlide === index
? "w-5 bg-[#FFF200]"
: "w-1.5 bg-white/70"
}`}
 />

))}

</div>

</Carousel>

</div>
          
          {/* Returns, Repairs & Exchanges */}

<div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4 font-poppins">

{returnSubmitted ? (

<div className="text-center py-4 bg-yellow-50 rounded-xl border border-yellow-200">

<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
<CheckCircle2 className="w-6 h-6 text-yellow-600" />
</div>

<div className="text-sm font-semibold text-gray-900">
Request Submitted
</div>

<div className="text-xs text-gray-600 mt-1">
Request ID: <span className="font-semibold">{returnRequestId}</span>
</div>

<div className="text-xs text-yellow-700 mt-1">
JB Hi-Fi support will review your request and contact you shortly.
</div>

</div>

) : (

<>

{/* Header */}

<div className="flex items-center justify-between mb-3">

<div className="flex items-center">

<div className="bg-[#FFF200] p-2 rounded-lg mr-3">
<RotateCcw className="h-4 w-4 text-black" />
</div>

<div>
<div className="text-sm font-semibold text-gray-900">
Returns, Repairs & Exchanges
</div>

<div className="text-xs text-gray-500">
Start a request for a product issue
</div>
</div>

</div>

<button
onClick={() => setShowReturnPanel(!showReturnPanel)}
className="text-xs font-medium text-black"
>
{showReturnPanel ? "Close" : "Start"}
</button>

</div>


{/* Policy Note */}

<div className="text-[11px] text-gray-500 mb-3 bg-gray-50 p-2 rounded-lg">
Items may be eligible for repair, replacement, or refund depending on the issue and product condition. 
</div>


{showReturnPanel && (

<div className="space-y-4">

{/* Product Selection */}

<div>

<div className="text-[11px] font-semibold text-gray-500 uppercase mb-2">
Select Product
</div>

<div className="space-y-2">

{currentReceipt.items.map((product) => (

<button
key={product.id}
onClick={() => {
setSelectedProduct(product.id)
setReturnType(null)
setReturnReason("")
}}
className={`w-full text-left p-3 rounded-xl border ${
selectedProduct === product.id
? "border-[#FFF200] bg-yellow-50"
: "border-gray-200"
}`}
>

<div className="text-sm font-medium text-gray-900">
{product.name}
</div>

<div className="text-[11px] text-gray-500">
{product.variant}
</div>

</button>

))}

</div>

</div>


{/* Action Type */}

{selectedProduct !== null && (

<div>

<div className="text-[11px] font-semibold text-gray-500 uppercase mb-2">
Request Type
</div>

<div className="flex gap-2">

<button
onClick={() => setReturnType("repair")}
className={`flex-1 border rounded-lg py-2 text-xs ${
returnType === "repair"
? "border-[#FFF200] bg-yellow-50"
: "border-gray-200"
}`}
>
Repair
</button>

<button
onClick={() => setReturnType("exchange")}
className={`flex-1 border rounded-lg py-2 text-xs ${
returnType === "exchange"
? "border-[#FFF200] bg-yellow-50"
: "border-gray-200"
}`}
>
Exchange
</button>

<button
onClick={() => setReturnType("return")}
className={`flex-1 border rounded-lg py-2 text-xs ${
returnType === "return"
? "border-[#FFF200] bg-yellow-50"
: "border-gray-200"
}`}
>
Return
</button>

</div>

</div>

)}


{/* Reason */}

{returnType && (

<div>

<div className="text-[11px] font-semibold text-gray-500 uppercase mb-2">
Reason
</div>

<div className="flex flex-wrap gap-2">

{[
"Defective Product",
"Wrong Item",
"Damaged Item",
"Missing Parts",
"Change of Mind"
].map((reason) => (

<button
key={reason}
onClick={() => setReturnReason(reason)}
className={`text-[11px] px-3 py-1 rounded-full border ${
returnReason === reason
? "bg-[#FFF200] text-black border-[#FFF200]"
: "border-gray-200"
}`}
>
{reason}
</button>

))}

</div>

</div>

)}


{/* Comment */}

{returnReason && (

<div>

<label className="text-[11px] font-semibold text-gray-500 uppercase">
Additional Details
</label>

<textarea
rows={3}
placeholder="Describe the issue or reason"
className="w-full mt-1 p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFF200]"
value={returnComment}
onChange={(e) => setReturnComment(e.target.value)}
/>

</div>

)}


{/* Refund */}

{returnType === "return" && returnReason && (

<div>

<div className="text-[11px] font-semibold text-gray-500 uppercase mb-2">
Refund Preference
</div>

<div className="flex gap-2">

<button
onClick={() => setRefundMethod("original")}
className={`flex-1 border rounded-lg py-2 text-xs ${
refundMethod === "original"
? "border-[#FFF200] bg-yellow-50"
: "border-gray-200"
}`}
>
Original Payment Method
</button>

<button
onClick={() => setRefundMethod("store")}
className={`flex-1 border rounded-lg py-2 text-xs ${
refundMethod === "store"
? "border-[#FFF200] bg-yellow-50"
: "border-gray-200"
}`}
>
Store Credit
</button>

</div>

</div>

)}


{/* Submit */}

{returnReason && (

<button
onClick={() => {
const id = generateReturnId()
setReturnRequestId(id)
setReturnSubmitted(true)
}}
className="w-full bg-[#FFF200] text-black h-10 text-xs font-semibold rounded-xl active:scale-[0.98]"
>
Submit Request
</button>

)}

</div>

)}

</>

)}

</div>
          
      {/* JB Hi-Fi Perks Activation */}

<div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4 font-poppins">

{profileUpdateSuccess ? (

<div className="text-center py-4 bg-yellow-50 rounded-xl border border-yellow-200">

<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
<svg
className="w-6 h-6 text-yellow-700"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24"
>
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
</svg>
</div>

<div className="text-sm font-semibold text-gray-900 mb-1">
You're now a JB Hi-Fi Perks Member
</div>

<div className="text-xs text-gray-600">
Your purchase is now linked to your JB Hi-Fi Perks profile.  
You'll receive member offers, birthday perks and early sale access.
</div>

</div>

) : (

<>

{/* Header */}

<div className="flex items-center mb-3">

<div className="bg-[#FFF200] p-2 rounded-lg mr-3">
<User2 className="h-4 w-4 text-black"/>
</div>

<div>
<div className="text-sm font-semibold text-gray-900">
Join JB Hi-Fi Perks
</div>

<div className="text-xs text-gray-500">
Unlock member deals, birthday perks and early access to sales.
</div>
</div>

</div>


{/* Form */}

<div className="space-y-3">

<div className="space-y-1">
<label className="text-[11px] font-semibold text-gray-400 uppercase">
Full Name
</label>

<input
type="text"
placeholder="Your name"
value={profile.name}
onChange={(e)=>setProfile(prev=>({...prev,name:e.target.value}))}
className="w-full h-10 px-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFF200]"
/>

</div>


<div className="space-y-1">

<label className="text-[11px] font-semibold text-gray-400 uppercase">
Email Address
</label>

<input
type="email"
placeholder="name@email.com"
value={profile.email}
onChange={(e)=>setProfile(prev=>({...prev,email:e.target.value}))}
className="w-full h-10 px-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFF200]"
/>

</div>


<div className="space-y-1">

<label className="text-[11px] font-semibold text-gray-400 uppercase">
Mobile Number
</label>

<input
type="tel"
placeholder="+61..."
value={profile.mobile}
onChange={(e)=>setProfile(prev=>({...prev,mobile:e.target.value}))}
className="w-full h-10 px-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFF200]"
/>

</div>

</div>


{/* CTA */}

<button
className="w-full mt-4 bg-black text-white h-11 text-xs font-semibold rounded-xl transition active:scale-[0.98]"
onClick={handleProfileUpdate}
>
Join Perks
</button>


<div className="text-[10px] text-gray-400 text-center mt-2">
By joining JB Hi-Fi Perks you agree to receive member offers and perks communications.
</div>

</>

)}

</div>
          {/* JB Hi-Fi Perks Benefits */}

<div className="bg-white rounded-2xl shadow-md border border-gray-200 mt-4 mx-3 overflow-hidden">

<div className="p-4">

{/* Header */}

<div className="flex items-center mb-4">

<div className="bg-[#FFF200] p-2 rounded-lg mr-3">
<Sparkles className="h-4 w-4 text-black"/>
</div>

<div>
<div className="text-sm font-semibold text-gray-900">
JB Hi-Fi Perks Benefits
</div>

<div className="text-xs text-gray-500">
Member benefits you unlock with every purchase
</div>
</div>

</div>


{/* Benefits Grid */}

<div className="grid grid-cols-2 gap-3">

<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
<div className="text-sm font-semibold text-gray-900">$10 Welcome Coupon</div>
<div className="text-xs text-gray-600 mt-1">
Receive a $10 coupon when you join JB Hi-Fi Perks.
</div>
</div>

<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
<div className="text-sm font-semibold text-gray-900">Member Deals</div>
<div className="text-xs text-gray-600 mt-1">
Access exclusive deals available only to Perks members.
</div>
</div>

<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
<div className="text-sm font-semibold text-gray-900">Early Sale Access</div>
<div className="text-xs text-gray-600 mt-1">
Get priority access to JB Hi-Fi sales and major events.
</div>
</div>

<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
<div className="text-sm font-semibold text-gray-900">Birthday Perks</div>
<div className="text-xs text-gray-600 mt-1">
Receive a special reward during your birthday month.
</div>
</div>

</div>


{/* Footer Note */}

<div className="mt-4 bg-gray-50 rounded-xl border border-gray-200 p-3 text-center">

<div className="text-xs text-gray-600">
Perks members also receive competition entries and special promotional offers throughout the year.
</div>

</div>

</div>

</div>
          

{/* Hottest Deals */}

<div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4">

{/* Header */}

<div className="flex items-center mb-4">

<div className="bg-[#FFF200] p-2 rounded-lg mr-3">
🔥
</div>

<div>
<div className="text-sm font-semibold text-gray-900">
Hottest Deals
</div>

<div className="text-xs text-gray-500">
This week's biggest JB Hi-Fi offers
</div>
</div>

</div>


{/* Products Grid */}

<div className="grid grid-cols-2 gap-4">


{/* Product 1 - Garmin */}

<div className="bg-gray-100 rounded-xl p-3 flex flex-col">

<img
src="/images/design-mode/garmin.png"
className="w-full object-contain h-36 mb-2"
/>

<div className="text-[10px] text-gray-500 mb-1">
Garmin
</div>

<div className="text-xs font-semibold text-gray-900 mb-1 leading-snug">
Garmin Epix Pro Gen 2 Sapphire Edition 47mm
</div>

<div className="relative border border-black">

<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] px-2 py-[2px] font-bold">
TICKET
</div>

<div className="bg-[#FFF200] text-center py-2">

<div className="text-[10px] line-through text-gray-700">
A$1699
</div>

<div className="text-lg font-extrabold text-red-600">
A$849
</div>

</div>

<div className="bg-red-600 text-white text-center text-[10px] py-1">
A$850 OFF
</div>

</div>

<a
href="https://www.jbhifi.com.au/products/garmin-epix-pro-gen-2-sapphire-edition-47mm-carbon-grey-dlc-titanium-with-black-band"
target="_blank"
className="mt-3 bg-green-600 text-white text-center text-xs py-2 rounded-md font-semibold"
>
Buy Now
</a>

</div>



{/* Product 2 - Bose */}

<div className="bg-gray-100 rounded-xl p-3 flex flex-col">

<img
src="/images/design-mode/bose.png"
className="w-full object-contain h-36 mb-2"
/>

<div className="text-[10px] text-gray-500 mb-1">
Bose
</div>

<div className="text-xs font-semibold text-gray-900 mb-1 leading-snug">
Bose QuietComfort Noise Cancelling Earbuds
</div>

<div className="relative border border-black">

<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] px-2 py-[2px] font-bold">
TICKET
</div>

<div className="bg-[#FFF200] text-center py-2">

<div className="text-[10px] line-through text-gray-700">
A$449
</div>

<div className="text-lg font-extrabold text-red-600">
A$249
</div>

</div>

<div className="bg-red-600 text-white text-center text-[10px] py-1">
A$200 OFF
</div>

</div>

<a
href="https://www.jbhifi.com.au/products/bose-quietcomfort-ultra-wireless-noise-cancelling-earbuds-gen-1-black"
target="_blank"
className="mt-3 bg-green-600 text-white text-center text-xs py-2 rounded-md font-semibold"
>
Buy Now
</a>

</div>



{/* Product 3 - Samsung */}

<div className="bg-gray-100 rounded-xl p-3 flex flex-col">

<img
src="/images/design-mode/samsung.png"
className="w-full object-contain h-36 mb-2"
/>

<div className="text-[10px] text-gray-500 mb-1">
Samsung
</div>

<div className="text-xs font-semibold text-gray-900 mb-1 leading-snug">
Samsung Galaxy S26 Ultra 5G 256GB (Black)
</div>

<div className="relative border border-black">

<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] px-2 py-[2px] font-bold">
TICKET
</div>

<div className="bg-[#FFF200] text-center py-2">

<div className="text-[10px] line-through text-gray-700">
A$2199
</div>

<div className="text-lg font-extrabold text-red-600">
A$1999
</div>

</div>

<div className="bg-red-600 text-white text-center text-[10px] py-1">
A$200 OFF
</div>

</div>

<a
href="https://www.jbhifi.com.au/products/samsung-galaxy-s26-ultra-5g-256gb-black"
target="_blank"
className="mt-3 bg-green-600 text-white text-center text-xs py-2 rounded-md font-semibold"
>
Buy Now
</a>

</div>



{/* Product 4 - Hisense */}

<div className="bg-gray-100 rounded-xl p-3 flex flex-col">

<img
src="/images/design-mode/hisense.png"
className="w-full object-contain h-36 mb-2"
/>

<div className="text-[10px] text-gray-500 mb-1">
Hisense
</div>

<div className="text-xs font-semibold text-gray-900 mb-1 leading-snug">
Hisense 65" Q6QAU 4K QLED Smart TV (2025)
</div>

<div className="relative border border-black">

<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] px-2 py-[2px] font-bold">
TICKET
</div>

<div className="bg-[#FFF200] text-center py-2">

<div className="text-[10px] line-through text-gray-700">
A$867
</div>

<div className="text-lg font-extrabold text-red-600">
A$763
</div>

</div>

<div className="bg-red-600 text-white text-center text-[10px] py-1">
A$104 OFF
</div>

</div>

<a
href="https://www.jbhifi.com.au/products/hisense-65-q6qau-4k-qled-smart-tv-2025"
target="_blank"
className="mt-3 bg-green-600 text-white text-center text-xs py-2 rounded-md font-semibold"
>
Buy Now
</a>

</div>


</div>


{/* Explore More */}

<a
href="https://www.jbhifi.com.au/collections/this-weeks-hottest-deals"
target="_blank"
className="block mt-5 bg-[#FFF200] text-black text-center py-3 rounded-xl text-sm font-semibold"
>
Explore More Deals
</a>

</div>
          
          {/* Receipt Actions */}

<div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4 font-poppins">

  <div className="grid grid-cols-3 gap-3">

    {/* Purchase History */}
    <button
      ref={historyButtonRef}
      onClick={handleTransactionHistoryOpen}
      className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl py-3 active:scale-[0.97] transition"
    >
      <div className="bg-[#FFF200] p-2 rounded-lg mb-1">
        <History className="h-4 w-4 text-black" />
      </div>

      <span className="text-[11px] font-semibold text-gray-800">
        History
      </span>
    </button>


    {/* Email Receipt */}
    <button
      onClick={handleEmailReceipt}
      className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl py-3 active:scale-[0.97] transition"
    >
      <div className="bg-[#FFF200] p-2 rounded-lg mb-1">
        <Mail className="h-4 w-4 text-black" />
      </div>

      <span className="text-[11px] font-semibold text-gray-800">
        Email
      </span>
    </button>


    {/* Download Receipt */}
    <button
      onClick={handleDownloadReceipt}
      className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl py-3 active:scale-[0.97] transition"
    >
      <div className="bg-[#FFF200] p-2 rounded-lg mb-1">
        <Download className="h-4 w-4 text-black" />
      </div>

      <span className="text-[11px] font-semibold text-gray-800">
        Download
      </span>
    </button>

  </div>

</div>
          
       {/* Need Help Section */}

<div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4 font-poppins">

{/* Header */}

<div className="flex items-center mb-3">

<div className="bg-[#FFF200] p-2 rounded-lg mr-3">
  <Send className="h-4 w-4 text-black" />
</div>

<h3 className="text-sm font-semibold text-gray-900">
  Need Help?
</h3>

</div>

<div className="grid grid-cols-3 gap-3">

{/* Chat Support */}
<button
  onClick={handleWhatsApp}
  className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl py-3 active:scale-[0.97] transition"
>

<div className="bg-[#FFF200] p-2 rounded-lg mb-1">
  <MessageSquare className="h-4 w-4 text-black" />
</div>

<span className="text-[11px] font-semibold text-gray-800">
  Chat
</span>

</button>


{/* Call Support */}
<button
  onClick={handleCall}
  className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl py-3 active:scale-[0.97] transition"
>

<div className="bg-[#FFF200] p-2 rounded-lg mb-1">
  <Phone className="h-4 w-4 text-black" />
</div>

<span className="text-[11px] font-semibold text-gray-800">
  Call
</span>

</button>


{/* Service Request */}
<button
  onClick={handleEmail}
  className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl py-3 active:scale-[0.97] transition"
>

<div className="bg-[#FFF200] p-2 rounded-lg mb-1">
  <Wrench className="h-4 w-4 text-black" />
</div>

<span className="text-[11px] font-semibold text-gray-800">
  Service
</span>

</button>

</div>

</div>

      {/* Social Media & Store Details */}

<div className="bg-white rounded-2xl border border-gray-200 shadow-md mx-3 mt-4 p-4 font-poppins">

{/* Header */}

<div className="flex items-center mb-4">

<div className="bg-[#FFF200] p-2 rounded-lg mr-3">
  <Share2 className="h-4 w-4 text-black" />
</div>

<h3 className="text-sm font-semibold text-gray-900">
  Stay Connected
</h3>

</div>


{/* Social Links */}

<div className="flex justify-center space-x-6 mb-4">

{/* Instagram */}
<button
  onClick={() => handleSocialLink("https://www.instagram.com/jbhifi/")}
  className="flex flex-col items-center"
>
  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center mb-1">
    <Instagram className="h-4 w-4 text-white" />
  </div>

  <span className="text-[11px] font-semibold text-gray-800">
    Instagram
  </span>
</button>


{/* Facebook */}
<button
  onClick={() => handleSocialLink("https://www.facebook.com/JBHiFi/")}
  className="flex flex-col items-center"
>
  <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center mb-1">
    <Facebook className="h-4 w-4 text-white" />
  </div>

  <span className="text-[11px] font-semibold text-gray-800">
    Facebook
  </span>
</button>


{/* Website */}
<button
  onClick={() => handleSocialLink("https://www.jbhifi.com.au/")}
  className="flex flex-col items-center"
>
  <div className="w-9 h-9 rounded-full bg-[#FFF200] flex items-center justify-center mb-1">
    <ExternalLink className="h-4 w-4 text-black" />
  </div>

  <span className="text-[11px] font-semibold text-gray-800">
    Website
  </span>
</button>

</div>


{/* Store Location */}

<div className="text-xs text-gray-600 text-center mb-3 bg-gray-50 p-3 rounded-xl">

<button
  onClick={() => setShowStoreLocation(!showStoreLocation)}
  className="w-full flex items-center justify-center mb-2 hover:text-black transition-colors"
>

<MapPin className="h-3 w-3 mr-1 text-black" />

<span className="font-semibold text-black">
  JB Hi-Fi Melbourne Central {showStoreLocation ? "▲" : "▼"}
</span>

</button>


{showStoreLocation && (

<div className="space-y-0.5">

<p className="font-semibold text-gray-900">
JB Hi-Fi
</p>

<p>
Shop 101B, L01 Building
</p>

<p>
211 La Trobe St
</p>

<p>
Melbourne VIC 3000
</p>

<p>
Australia
</p>

<p className="mt-2 text-[10px]">
Store: Melbourne Central
</p>

<p className="mt-1 text-black font-semibold">
Store Associate: {currentReceipt.associate}
</p>

</div>

)}

</div>


{/* Terms */}

<button
className="w-full text-xs text-gray-500 hover:text-black h-6 font-medium"
onClick={() => setShowTerms(!showTerms)}
>

Terms & Conditions {showTerms ? "▲" : "▼"}

</button>


{showTerms && (

<div className="text-[11px] text-gray-500 mt-2 space-y-1 px-2 font-medium">

<p>• Products sold are subject to manufacturer warranty terms.</p>

<p>• Pricing and promotional offers may vary across JB Hi-Fi stores.</p>

<p>• Prices displayed include applicable taxes.</p>

<p>• For support visit www.jbhifi.com.au/support.</p>

</div>

)}


{/* Powered by RDEP */}

<div className="text-center mt-3 pt-3 border-t border-gray-100">

<div className="flex items-center justify-center space-x-1">

<span className="text-xs text-gray-400 font-medium">
Powered by
</span>

<a
href="https://www.rdep.io"
target="_blank"
rel="noopener noreferrer"
className="inline-flex items-center"
>

<Image
src="/images/design-mode/RDEP cropped.png"
alt="RDEP"
width={60}
height={16}
className="object-contain"
/>

</a>

</div>

</div>

</div>
          <div id="height-marker" style={{ height: "1px" }} />
        </div>


        {/* Transaction History Modal */}
{showTransactionHistory && (

<div className="fixed inset-0 z-[9999] flex items-center justify-center">

{/* Backdrop */}
<div
className="absolute inset-0 bg-black/40 backdrop-blur-sm"
onClick={() => setShowTransactionHistory(false)}
/>


{/* Modal */}
<div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 shadow-2xl border border-gray-200 font-poppins overflow-hidden">


{/* Header */}
<div className="flex justify-between items-center p-4 border-b border-gray-100">

<div className="flex items-center">

<div className="bg-[#FFF200] p-2 rounded-lg mr-3">
<History className="h-4 w-4 text-black" />
</div>

<h3 className="text-sm font-semibold text-gray-900">
Purchase History
</h3>

</div>

<button
className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
onClick={() => setShowTransactionHistory(false)}
>

<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
className="h-4 w-4 text-gray-500"
>
<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
</svg>

</button>

</div>


{/* Transaction List */}
<div className="max-h-80 overflow-y-auto p-4 space-y-3">

{transactionHistory.map((transaction) => (

<button
key={transaction.id}
onClick={() => {
setCurrentReceiptId(transaction.id)
setShowTransactionHistory(false)
window.scrollTo({ top: 0, behavior: "smooth" })
}}
className="w-full flex items-center p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#FFF200] transition"
>

<div className="bg-white border border-gray-200 p-2 rounded-lg mr-3">
<FileText className="h-4 w-4 text-black" />
</div>

<div className="flex-grow text-left">

<div className="text-sm font-semibold text-gray-900">
JB Hi-Fi
</div>

<div className="text-[11px] text-gray-500">
{transaction.date}
</div>

</div>

<div className="text-sm font-semibold text-red-600">
A${transaction.amount.toFixed(2)}
</div>

</button>

))}

</div>

</div>

</div>

)}

        {/* Refer & Earn Modal */}
        {showReferModal && (
          <div
            style={getModalPositionRelativeToContainer(referButtonRef)}
            className="bg-white rounded-lg w-full overflow-hidden shadow-xl z-[9999] max-w-sm"
          >
            <div className="flex justify-between items-center p-4 border-b bg-blue-700 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Refer & Earn
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-blue-600"
                onClick={() => setShowReferModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="h-8 w-8 text-blue-700" />
                </div>
                <h4 className="text-lg font-semibold text-blue-700 mb-2">Share & Earn RM50!</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Refer friends to Skechers and both of you get RM50 off your next purchase!
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-xs font-medium text-blue-800 mb-1">Your Referral Code</div>
                <div className="text-lg font-bold text-blue-700 text-center">SKECH{customerName.toUpperCase()}50</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Try Skechers! Use code SKECH${customerName.toUpperCase()}50 for RM50 off!`,
                    )
                    setShowReferModal(false)
                  }}
                >
                  Copy Code
                </Button>
                <Button
                  className="bg-blue-700 hover:bg-blue-800 text-white"
                  onClick={() => {
                    window.open(
                      `https://wa.me/60362032728?text=Try Skechers Malaysia! Use my code SKECH${customerName.toUpperCase()}50 for RM50 off your next purchase!`,
                    )
                    setShowReferModal(false)
                  }}
                >
                  Share Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
