import type { Partner, PartnerFormValues } from '../types/partner'
import { resolveImageUrl } from '../api/client'
import ItemFormModal from './ItemFormModal'
import type { ItemFormSubmitValues } from './ItemFormModal'

interface Props {
  partner: Partner | null
  onSubmit: (values: PartnerFormValues) => Promise<void>
  onClose: () => void
}

export default function PartnerFormModal({ partner, onSubmit, onClose }: Props) {
  function handleSubmit(values: ItemFormSubmitValues) {
    return onSubmit({ name: values.name, note: values.description, image: values.image })
  }

  return (
    <ItemFormModal
      title={partner ? 'تعديل المحل' : 'إضافة محل جديد'}
      namePlaceholder="مثال: مطعم الأمانة"
      descriptionLabel="ملاحظة (إن وجدت)"
      descriptionPlaceholder="ملاحظة اختيارية عن التعامل مع هذا المحل"
      initialName={partner?.name}
      initialDescription={partner?.note ?? ''}
      initialImageUrl={resolveImageUrl(partner?.image ?? null)}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  )
}
