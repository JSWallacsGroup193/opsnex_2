import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Flashlight, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react"
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { scannerService } from "@/services/scanner.service"
import type { SKUData } from "@/types/view-models/barcode"
import type { SKU } from "@/types"

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onSKUFound: (sku: SKUData) => void
}

export function BarcodeScanner({ onScan, onSKUFound }: BarcodeScannerProps) {
  const navigate = useNavigate()
  const [scanning, setScanning] = useState(true)
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const [skuData, setSkuData] = useState<SKUData | null>(null)
  const [fullSKU, setFullSKU] = useState<SKU | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [flashlightOn, setFlashlightOn] = useState(false)
  const [hasFlashlight, setHasFlashlight] = useState(false)
  
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanningRef = useRef(true)
  const readerElementId = "barcode-reader"

  useEffect(() => {
    startScanner()
    return () => {
      stopScanner()
    }
  }, [])

  const startScanner = async () => {
    try {
      // Request camera access first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      streamRef.current = stream

      // Check if flashlight is available
      const track = stream.getVideoTracks()[0]
      const capabilities = track.getCapabilities() as any
      setHasFlashlight("torch" in capabilities)

      // Initialize html5-qrcode
      const html5Qrcode = new Html5Qrcode(readerElementId)
      html5QrcodeRef.current = html5Qrcode

      // Start scanning with support for 1D barcodes and QR codes
      await html5Qrcode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.ITF,
          ],
        } as any,
        onScanSuccess,
        onScanError
      )
    } catch (error: any) {
      console.error("Camera access error:", error)
      setCameraError(
        error.name === "NotAllowedError"
          ? "Camera access denied. Please allow camera permissions and reload."
          : "Unable to access camera. Please check your device settings."
      )
    }
  }

  const stopScanner = async () => {
    if (html5QrcodeRef.current) {
      try {
        await html5QrcodeRef.current.stop()
        html5QrcodeRef.current.clear()
      } catch (error) {
        console.error("Error stopping scanner:", error)
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const toggleFlashlight = async () => {
    if (!streamRef.current) return

    const track = streamRef.current.getVideoTracks()[0]
    try {
      await track.applyConstraints({
        // @ts-ignore
        advanced: [{ torch: !flashlightOn }],
      })
      setFlashlightOn(!flashlightOn)
    } catch (error) {
      console.error("Flashlight toggle error:", error)
    }
  }

  const onScanSuccess = async (decodedText: string) => {
    if (!scanningRef.current) return

    // Vibrate on scan
    if ("vibrate" in navigator) {
      navigator.vibrate(200)
    }

    setScannedBarcode(decodedText)
    setScanning(false)
    scanningRef.current = false
    setLoading(true)
    setError(null)
    onScan(decodedText)

    // Pause scanner
    if (html5QrcodeRef.current) {
      try {
        await html5QrcodeRef.current.pause()
      } catch (error) {
        console.error("Error pausing scanner:", error)
      }
    }

    // Lookup SKU from backend
    try {
      const response = await scannerService.scanBarcode(decodedText)
      
      if (response.found && response.sku) {
        const mappedSKU = mapSKUtoSKUData(response.sku)
        setSkuData(mappedSKU)
        setFullSKU(response.sku) // Store full SKU for navigation
        onSKUFound(mappedSKU)
      } else {
        setSkuData(null)
        setFullSKU(null)
      }
    } catch (error: any) {
      console.error("SKU lookup error:", error)
      setError(error.response?.data?.message || "Failed to lookup barcode")
      setSkuData(null)
      setFullSKU(null)
    } finally {
      setLoading(false)
    }
  }

  const onScanError = (errorMessage: string) => {
    // Ignore continuous scanning errors (they're normal)
    if (errorMessage.includes("NotFoundException") || errorMessage.includes("No MultiFormat")) {
      return
    }
    console.log("Scan error:", errorMessage)
  }

  const mapSKUtoSKUData = (sku: SKU): SKUData => {
    // Map backend SKU to component SKUData format
    return {
      barcode: sku.barcode || "",
      description: sku.description || sku.name || "Unknown item",
      category: sku.category || "Uncategorized",
      stock: sku.onHand || 0,
      location: "See inventory for location details",
    }
  }

  const handleScanAnother = async () => {
    setScannedBarcode(null)
    setSkuData(null)
    setFullSKU(null)
    setError(null)
    setScanning(true)
    scanningRef.current = true
    setLoading(false)

    // Resume scanner
    if (html5QrcodeRef.current) {
      try {
        await html5QrcodeRef.current.resume()
      } catch (error) {
        console.error("Error resuming scanner:", error)
      }
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleViewDetails = () => {
    if (!fullSKU) return
    // Navigate to SKU detail page using the full SKU ID
    navigate(`/inventory/${fullSKU.id}`)
    console.log("View details:", fullSKU)
  }

  const handleAddToWorkOrder = () => {
    if (!skuData) return
    // In real implementation, this would open a modal to select work order
    alert("Add to Work Order - would open work order selection modal")
    console.log("Add to work order:", skuData)
  }

  const handleSearchManually = () => {
    navigate("/inventory")
  }

  // Camera error state
  if (cameraError) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-[#0f172a] flex items-center justify-center p-6">
        <Card className="border-red-600 bg-[#1e293b] p-8 max-w-md">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-100">Camera Access Required</h2>
            <p className="text-slate-400">{cameraError}</p>
            <div className="space-y-2 pt-4">
              <Button onClick={handleBack} className="w-full bg-teal-500 text-white hover:bg-teal-600">
                Go Back
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0f172a]">
      {/* Scanner Container */}
      <div id={readerElementId} className="absolute inset-0" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#0f172a]/40 pointer-events-none" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-[#0f172a] to-transparent p-4 pb-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-teal-400 hover:bg-teal-400/10 hover:text-teal-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-slate-100">Scan Barcode</h1>
          {hasFlashlight ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFlashlight}
              className={`${
                flashlightOn ? "bg-teal-400/20 text-teal-300" : "text-teal-400 hover:bg-teal-400/10 hover:text-teal-300"
              }`}
            >
              <Flashlight className="h-6 w-6" />
            </Button>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </div>

      {/* Scanning Guide */}
      {scanning && !scannedBarcode && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="relative">
            {/* Animated Scanning Frame */}
            <div className="relative h-48 w-64 rounded-lg border-[3px] border-teal-400">
              {/* Animated Corners */}
              <div className="absolute -top-1 -left-1 h-8 w-8 animate-pulse rounded-tl-lg border-l-4 border-t-4 border-teal-400" />
              <div className="absolute -top-1 -right-1 h-8 w-8 animate-pulse rounded-tr-lg border-r-4 border-t-4 border-teal-400" />
              <div className="absolute -bottom-1 -left-1 h-8 w-8 animate-pulse rounded-bl-lg border-b-4 border-l-4 border-teal-400" />
              <div className="absolute -bottom-1 -right-1 h-8 w-8 animate-pulse rounded-br-lg border-b-4 border-r-4 border-teal-400" />
            </div>
            <p className="mt-4 text-center text-sm text-slate-100">Position barcode within frame</p>
          </div>
        </div>
      )}

      {/* Bottom Sheet - Result */}
      {scannedBarcode && (
        <div className="absolute bottom-0 left-0 right-0 z-20 animate-slide-up rounded-t-2xl bg-[#334155] p-6 shadow-2xl">
          {loading ? (
            // Loading State
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 text-teal-400 animate-spin" />
                <div>
                  <h2 className="text-lg font-bold text-slate-100">Looking up barcode...</h2>
                  <p className="font-mono text-xl text-teal-400">{scannedBarcode}</p>
                </div>
              </div>
            </div>
          ) : error ? (
            // Error State
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100">Error</h2>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  onClick={handleScanAnother}
                  className="w-full bg-slate-600 text-slate-100 hover:bg-slate-700"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : skuData ? (
            // Success State
            <div className="space-y-4">
              {/* Success Header */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100">Barcode Scanned!</h2>
                  <p className="font-mono text-2xl text-teal-400">{scannedBarcode}</p>
                </div>
              </div>

              {/* SKU Information */}
              <Card className="border-slate-600 bg-[#1e293b] p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-100">{skuData.description}</h3>
                    <Badge className="bg-teal-500 text-white hover:bg-teal-600">{skuData.category}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className={`text-sm font-medium ${skuData.stock > 0 ? "text-emerald-400" : "text-red-400"}`}>
                      On Hand: {skuData.stock} units
                    </p>
                    <p className="text-sm text-slate-400">{skuData.location}</p>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="space-y-2">
                <Button onClick={handleViewDetails} className="w-full bg-teal-500 text-white hover:bg-teal-600">
                  View Full Details
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddToWorkOrder}
                  className="w-full border-teal-500 text-teal-400 hover:bg-teal-500/10 bg-transparent"
                >
                  Add to Work Order
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleScanAnother}
                  className="w-full bg-slate-600 text-slate-100 hover:bg-slate-700"
                >
                  Scan Another
                </Button>
              </div>
            </div>
          ) : (
            // Not Found State
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                  <AlertTriangle className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100">Barcode not found in inventory</h2>
                  <p className="font-mono text-xl text-slate-400">{scannedBarcode}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="link" onClick={handleSearchManually} className="w-full text-teal-400 hover:text-teal-300">
                  Search manually
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleScanAnother}
                  className="w-full bg-slate-600 text-slate-100 hover:bg-slate-700"
                >
                  Scan Another
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
