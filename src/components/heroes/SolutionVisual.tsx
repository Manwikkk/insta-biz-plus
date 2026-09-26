import type { Solution } from '@/content/data'
import { SolutionFlow } from './SolutionFlow'
import { FactoryOrder } from './solutions/FactoryOrder'
import { ComplianceCalendar } from './solutions/ComplianceCalendar'
import { VisaJourney } from './solutions/VisaJourney'
import { UnitInventory } from './solutions/UnitInventory'
import { AdmissionFunnel } from './solutions/AdmissionFunnel'
import { ItineraryBuilder } from './solutions/ItineraryBuilder'
import { RenewalRadar } from './solutions/RenewalRadar'
import { LenderTracker } from './solutions/LenderTracker'
import { ErpHub } from './solutions/ErpHub'
import { PatientJourney } from './solutions/PatientJourney'
import { PayrollRun } from './solutions/PayrollRun'
import { StockScan } from './solutions/StockScan'

const BY_SLUG: Record<string, (p: { ints: string[] }) => React.JSX.Element> = {
  'manufacturing-crm-software': FactoryOrder,
  'ca-crm-software': ComplianceCalendar,
  'visa-immigration-crm-software': VisaJourney,
  'real-estate-crm-software': UnitInventory,
  'education-crm-software': AdmissionFunnel,
  'travel-agency-crm-software': ItineraryBuilder,
  'insurance-crm-software': RenewalRadar,
  'loan-management-software': LenderTracker,
  'erp-software-development': ErpHub,
  'hospital-management-software': PatientJourney,
  'hrms-payroll-software': PayrollRun,
  'inventory-management-software': StockScan,
}

/**
 * Hero figure for a solution page: that industry's software doing its most telling job
 * (a quote going out, a unit being booked, a renewal landing…). Falls back to the generic
 * workflow for any solution without its own scene.
 */
export function SolutionVisual({ s }: { s: Solution }) {
  const Visual = BY_SLUG[s.slug]
  return Visual ? <Visual ints={s.overview.integrations} /> : <SolutionFlow s={s} />
}
