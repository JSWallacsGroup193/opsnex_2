import { useState, useEffect } from 'react'
import { Plus, Home, Wrench, ChevronDown, ChevronRight, MapPin, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { crmService } from '@/services/crm.service'
import toast from 'react-hot-toast'
import { AddPropertyDialog } from '@/components/accounts/add-property-dialog'
import { AddEquipmentDialog } from '@/components/accounts/add-equipment-dialog'

interface Property {
  id: string
  accountId: string
  name: string
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL'
  address?: any
  equipment?: Equipment[]
  _count?: {
    equipment: number
  }
}

interface Equipment {
  id: string
  propertyId: string
  type: string
  manufacturer?: string
  model?: string
  serialNumber?: string
  installDate?: string
  warrantyExpiry?: string
  lastServiceDate?: string
  notes?: string
}

interface PropertiesTabProps {
  accountId: string
  onViewServiceHistory: (equipmentId: string) => void
}

export function PropertiesTab({ accountId, onViewServiceHistory }: PropertiesTabProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedProperties, setExpandedProperties] = useState<Set<string>>(new Set())
  const [expandedEquipment, setExpandedEquipment] = useState<Set<string>>(new Set())
  const [showAddPropertyDialog, setShowAddPropertyDialog] = useState(false)
  const [showAddEquipmentDialog, setShowAddEquipmentDialog] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)

  useEffect(() => {
    loadProperties()
  }, [accountId])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const data = await crmService.getProperties(accountId)
      setProperties(data)
    } catch (error: any) {
      console.error('Failed to load properties:', error)
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const toggleProperty = (propertyId: string) => {
    setExpandedProperties(prev => {
      const next = new Set(prev)
      if (next.has(propertyId)) {
        next.delete(propertyId)
      } else {
        next.add(propertyId)
      }
      return next
    })
  }

  const toggleEquipment = (equipmentId: string) => {
    setExpandedEquipment(prev => {
      const next = new Set(prev)
      if (next.has(equipmentId)) {
        next.delete(equipmentId)
      } else {
        next.add(equipmentId)
      }
      return next
    })
  }

  const formatAddress = (address: any) => {
    if (!address) return 'No address'
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode
    ].filter(Boolean)
    return parts.join(', ') || 'No address'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading properties...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Properties & Equipment</h3>
        <Button onClick={() => setShowAddPropertyDialog(true)} className="bg-teal-500 text-white hover:bg-teal-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      <div className="space-y-3">
        {properties.map((property) => {
          const isExpanded = expandedProperties.has(property.id)
          const equipmentCount = property._count?.equipment || property.equipment?.length || 0

          return (
            <div key={property.id} className="bg-slate-700 rounded-lg border border-slate-600 overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-slate-600/50 transition-colors"
                onClick={() => toggleProperty(property.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <Home className="h-5 w-5 text-teal-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-slate-100 font-semibold">{property.name}</h4>
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-600 text-slate-300">
                          {property.propertyType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        <p className="text-sm text-slate-400">{formatAddress(property.address)}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-slate-500">
                          {equipmentCount} {equipmentCount === 1 ? 'equipment' : 'equipment items'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-200 p-1">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-600 bg-slate-800/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-semibold text-slate-300">Equipment</h5>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPropertyId(property.id)
                        setShowAddEquipmentDialog(true)
                      }}
                      className="bg-teal-600 text-white hover:bg-teal-700"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Equipment
                    </Button>
                  </div>

                  {property.equipment && property.equipment.length > 0 ? (
                    <div className="space-y-2">
                      {property.equipment.map((equipment) => {
                        const isEquipExpanded = expandedEquipment.has(equipment.id)
                        return (
                          <div
                            key={equipment.id}
                            className="bg-slate-700 rounded-lg border border-slate-600"
                          >
                            <div
                              className="p-3 cursor-pointer hover:bg-slate-600/50 transition-colors"
                              onClick={() => toggleEquipment(equipment.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-2 flex-1">
                                  <div className="h-8 w-8 rounded bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                                    <Wrench className="h-4 w-4 text-teal-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h6 className="text-slate-100 font-medium text-sm">{equipment.type}</h6>
                                    {equipment.manufacturer && equipment.model && (
                                      <p className="text-xs text-slate-400 mt-0.5">
                                        {equipment.manufacturer} - {equipment.model}
                                      </p>
                                    )}
                                    {equipment.serialNumber && (
                                      <p className="text-xs text-slate-500 mt-0.5">
                                        SN: {equipment.serialNumber}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-200 p-1">
                                  {isEquipExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {isEquipExpanded && (
                              <div className="border-t border-slate-600 bg-slate-800/30 p-3 space-y-2">
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  {equipment.installDate && (
                                    <div>
                                      <span className="text-slate-500">Installed:</span>
                                      <span className="text-slate-300 ml-1">{equipment.installDate}</span>
                                    </div>
                                  )}
                                  {equipment.lastServiceDate && (
                                    <div>
                                      <span className="text-slate-500">Last Service:</span>
                                      <span className="text-slate-300 ml-1">{equipment.lastServiceDate}</span>
                                    </div>
                                  )}
                                  {equipment.warrantyExpiry && (
                                    <div>
                                      <span className="text-slate-500">Warranty:</span>
                                      <span className="text-slate-300 ml-1">{equipment.warrantyExpiry}</span>
                                    </div>
                                  )}
                                </div>
                                {equipment.notes && (
                                  <div className="pt-2 border-t border-slate-600">
                                    <p className="text-xs text-slate-400">{equipment.notes}</p>
                                  </div>
                                )}
                                <div className="pt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onViewServiceHistory(equipment.id)
                                    }}
                                    className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 text-xs"
                                  >
                                    View Service History
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600 border-dashed text-center">
                      <AlertCircle className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm mb-3">No equipment registered for this property</p>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedPropertyId(property.id)
                          setShowAddEquipmentDialog(true)
                        }}
                        className="bg-teal-600 text-white hover:bg-teal-700"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add First Equipment
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {properties.length === 0 && (
        <div className="bg-slate-700 rounded-lg p-12 border border-slate-600 text-center">
          <Home className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">No properties registered yet</p>
          <Button onClick={() => setShowAddPropertyDialog(true)} className="bg-teal-500 text-white hover:bg-teal-600">
            <Plus className="h-4 w-4 mr-2" />
            Add First Property
          </Button>
        </div>
      )}

      <AddPropertyDialog
        open={showAddPropertyDialog}
        onOpenChange={setShowAddPropertyDialog}
        accountId={accountId}
        onSuccess={loadProperties}
      />

      <AddEquipmentDialog
        open={showAddEquipmentDialog}
        onOpenChange={setShowAddEquipmentDialog}
        propertyId={selectedPropertyId || ''}
        onSuccess={loadProperties}
      />
    </div>
  )
}
