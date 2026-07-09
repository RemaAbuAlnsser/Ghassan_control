import type { Company, CompanyFormValues } from '../types/company'
import { resolveImageUrl } from '../api/client'
import ItemFormModal from './ItemFormModal'
import type { ItemFormSubmitValues } from './ItemFormModal'

interface Props {
  company: Company | null
  onSubmit: (values: CompanyFormValues) => Promise<void>
  onClose: () => void
}

export default function CompanyFormModal({ company, onSubmit, onClose }: Props) {
  function handleSubmit(values: ItemFormSubmitValues) {
    return onSubmit({ name: values.name, note: values.description, image: values.image })
  }

  return (
    <ItemFormModal
      title={company ? 'تعديل الشركة' : 'إضافة شركة جديدة'}
      namePlaceholder="مثال: شركة الاتحاد"
      descriptionLabel="ملاحظة (إن وجدت)"
      descriptionPlaceholder="ملاحظة اختيارية عن الشركة"
      initialName={company?.name}
      initialDescription={company?.note ?? ''}
      initialImageUrl={resolveImageUrl(company?.image ?? null)}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  )
}
