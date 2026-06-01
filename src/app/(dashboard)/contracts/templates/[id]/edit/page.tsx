export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getContractTemplate } from '@/lib/db/sqlite'
import { ContractTemplateFormPage } from '@/components/contracts/ContractTemplateFormPage'

export default function EditContractTemplatePage({ params }: { params: { id: string } }) {
  const template = getContractTemplate(params.id)
  if (!template) notFound()

  return (
    <ContractTemplateFormPage
      mode="edit"
      templateId={params.id}
      initialData={{
        name: template.name,
        description: template.description ?? '',
        content: template.content,
        isDefault: template.isDefault,
      }}
    />
  )
}
