'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Warning, CircleNotch, CloudArrowUp, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { getContractStatusConfig, getInvoiceStatusConfig } from '@/lib/utils'
import type { ContractStatus, InvoiceStatus, SelectOption } from '@/types'
import { Button as ShadcnButton } from '@/components/ui/button'
import { Input as ShadcnInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Card as ShadcnCard,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type LegacyButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning'

type LegacyButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LegacyButtonVariant
  size?: LegacyButtonSize
  loading?: boolean
  icon?: React.ReactNode
}

const buttonVariantClass: Record<LegacyButtonVariant, string> = {
  primary: '',
  secondary: 'bg-zinc-900 text-white hover:bg-zinc-800',
  ghost: '',
  danger: '',
  success: 'bg-green-600 text-white hover:bg-green-700',
  warning: 'bg-amber-600 text-white hover:bg-amber-700',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const shadcnVariant =
    variant === 'ghost'
      ? 'outline'
      : variant === 'danger'
        ? 'destructive'
        : variant === 'secondary'
          ? 'secondary'
          : 'default'
  const shadcnSize = size === 'md' ? 'default' : size

  return (
    <ShadcnButton
      variant={shadcnVariant}
      size={shadcnSize}
      className={cn(buttonVariantClass[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <CircleNotch className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </ShadcnButton>
  )
}

export function InvoiceBadge({ status }: { status: InvoiceStatus }) {
  const config = getInvoiceStatusConfig(status)
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  )
}

export function ContractBadge({ status }: { status: ContractStatus }) {
  const config = getContractStatusConfig(status)
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  )
}

export function GlobalBadge() {
  return <Badge variant="outline">Global</Badge>
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  backHref?: string
  backLabel?: string
  icon?: React.ReactNode
}

export function PageHeader({
  title,
  subtitle,
  action,
  backHref,
  backLabel,
  icon,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      {backHref && (
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          {backLabel || 'Back'}
        </Link>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            {icon}
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <ShadcnCard className={className}>
      {padding ? <CardContent className="p-5">{children}</CardContent> : children}
    </ShadcnCard>
  )
}

interface SectionCardProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function SectionCard({ title, icon, children, action, className }: SectionCardProps) {
  return (
    <ShadcnCard className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-4 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent className="p-5 pt-0">{children}</CardContent>
    </ShadcnCard>
  )
}

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 opacity-40">{icon}</div>}
      <p className="font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  subValue?: string
  icon?: React.ReactNode
  valueColor?: string
  accent?: string
  accentPosition?: 'left' | 'top'
}

export function StatCard({ label, value, subValue, valueColor, accent, accentPosition = 'left' }: StatCardProps) {
  return (
    <ShadcnCard className={cn(
      'overflow-hidden shadow-sm',
      accent && accentPosition === 'left' && `border-l-4 ${accent}`,
      accent && accentPosition === 'top' && `border-t-2 ${accent}`,
    )}>
      <CardContent className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className={cn('mt-1 text-2xl font-bold', valueColor || 'text-foreground')}>
          {value}
        </p>
        {subValue && <p className="mt-0.5 text-xs text-muted-foreground">{subValue}</p>}
      </CardContent>
    </ShadcnCard>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  prefix?: string
}

export function Input({ label, error, helper, prefix, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <ShadcnInput
          id={inputId}
          className={cn(prefix && 'pl-7', error && 'border-destructive', className)}
          {...props}
        />
      </div>
      {helper && !error && <p className="text-xs text-muted-foreground">{helper}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
}

export function Textarea({ label, error, helper, className, id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      {label && <Label htmlFor={textareaId}>{label}</Label>}
      <ShadcnTextarea
        id={textareaId}
        className={cn(error && 'border-destructive', className)}
        {...props}
      />
      {helper && !error && <p className="text-xs text-muted-foreground">{helper}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  error?: string
  helper?: string
  options: readonly SelectOption[] | readonly { value: string; label: string }[]
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export function Select({
  label,
  error,
  helper,
  options,
  placeholder,
  value,
  defaultValue,
  onChange,
  id,
  disabled,
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const selectedValue = value === undefined ? undefined : String(value)

  return (
    <div className="space-y-1.5">
      {label && <Label htmlFor={selectId}>{label}</Label>}
      <ShadcnSelect
        value={selectedValue}
        defaultValue={defaultValue ? String(defaultValue) : undefined}
        disabled={disabled}
        onValueChange={(nextValue) => {
          onChange?.({
            target: { value: nextValue },
          } as React.ChangeEvent<HTMLSelectElement>)
        }}
      >
        <SelectTrigger id={selectId} className={cn(error && 'border-destructive')}>
          <SelectValue placeholder={placeholder || 'Select an option'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>
      {helper && !error && <p className="text-xs text-muted-foreground">{helper}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default' | 'primary'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={variant === 'danger' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : undefined}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  maxWidth?: string
}

export function Modal({ open, title, onClose, children, maxWidth }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className={maxWidth}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

interface AlertBannerProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
}

export function AlertBanner({ type, message, onClose }: AlertBannerProps) {
  const className = {
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
  }[type]

  return (
    <div className={cn('mb-4 flex items-center justify-between rounded-lg border p-4 text-sm', className)}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
          <X size={16} />
        </button>
      )}
    </div>
  )
}

interface TrialBannerProps {
  daysRemaining: number
  price: number
  onDismiss: () => void
  onUpgrade: () => void
}

export function TrialBanner({ daysRemaining, price, onDismiss, onUpgrade }: TrialBannerProps) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-[#C7C4FF] bg-accent p-4">
      <div>
        <p className="font-semibold text-primary">Free trial active</p>
        <p className="text-sm text-muted-foreground">
          {daysRemaining} days remaining. Upgrade for ${price}.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onUpgrade}>Upgrade</Button>
        <Button variant="ghost" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  )
}

interface DropZoneProps {
  onFile: (file: File) => void
  accept?: string
  helperText?: string
}

export function DropZone({ onFile, accept = '.csv,.xls,.xlsx', helperText }: DropZoneProps) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center transition hover:bg-muted">
      <CloudArrowUp className="mb-3 h-8 w-8 text-muted-foreground" />
      <span className="text-sm font-medium">Drop a file here or browse</span>
      {helperText && <span className="mt-1 text-xs text-muted-foreground">{helperText}</span>}
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFile(file)
        }}
      />
    </label>
  )
}

interface PlaceholderGridProps {
  placeholders: readonly { key: string; label: string }[]
  onInsert: (placeholder: string) => void
}

export function PlaceholderGrid({ placeholders, onInsert }: PlaceholderGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {placeholders.map((placeholder) => (
        <button
          key={placeholder.key}
          type="button"
          className="rounded-md border bg-card px-3 py-2 text-left text-xs transition hover:bg-accent"
          onClick={() => onInsert(placeholder.key)}
        >
          <span className="block font-medium text-foreground">{placeholder.label}</span>
          <code className="text-muted-foreground">{placeholder.key}</code>
        </button>
      ))}
    </div>
  )
}

export function WarningIcon() {
  return <Warning className="h-5 w-5 text-amber-600" />
}
