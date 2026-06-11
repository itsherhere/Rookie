import type { PayrollCalculation } from '../types';

/**
 * Calculate net pay for an employee.
 *
 * Formula: Net Pay = Base Salary + Bonus - Deductions
 *
 * This is a simplified preview calculation — not real payroll processing.
 */
export function calculateNetPay(
  baseSalary: number,
  bonus: number,
  deductions: number
): PayrollCalculation {
  if (baseSalary < 0 || bonus < 0 || deductions < 0) {
    throw new Error('Payroll values cannot be negative');
  }

  const net_pay = baseSalary + bonus - deductions;

  return {
    base_salary: baseSalary,
    bonus,
    deductions,
    net_pay: Math.max(0, net_pay), // net pay can't go below 0
  };
}

/**
 * Format a month string (YYYY-MM) to a readable label.
 * Example: "2024-05" → "May 2024"
 */
export function formatPayrollMonth(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
