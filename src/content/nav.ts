import type { IconName } from '@/components/ui/Icon'
import type { ServiceId } from './services'

/** The icon each navigation destination carries in the menus. */
export const serviceIcon: Record<ServiceId, IconName> = {
  automation: 'workflow',
  mobile: 'smartphone',
  ai: 'sparkles',
  crm: 'database',
  web: 'browser',
}

export const locationIcon: Record<string, IconName> = {
  '/web-development-company-in-ahmedabad': 'browser',
  '/software-development-company-in-ahmedabad': 'code',
  '/mobile-app-development-company-in-ahmedabad': 'smartphone',
  '/odoo-implementation-company-in-ahmedabad': 'modules',
}

export const solutionIcon: Record<string, IconName> = {
  'manufacturing-crm-software': 'factory',
  'ca-crm-software': 'calculator',
  'visa-immigration-crm-software': 'globe',
  'real-estate-crm-software': 'building',
  'education-crm-software': 'graduation',
  'travel-agency-crm-software': 'plane',
  'insurance-crm-software': 'shield',
  'loan-management-software': 'banknote',
  'erp-software-development': 'layers',
  'hospital-management-software': 'medical',
  'hrms-payroll-software': 'users',
  'inventory-management-software': 'package',
}

export const socialIcon: Record<string, IconName> = {
  LinkedIn: 'linkedin',
  Instagram: 'instagram',
  X: 'x',
  Facebook: 'facebook',
}
