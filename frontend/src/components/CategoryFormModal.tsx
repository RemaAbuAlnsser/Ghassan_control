import type { Category, CategoryFormValues } from '../types/category'
import { resolveImageUrl } from '../api/client'
import ItemFormModal from './ItemFormModal'
import type { ItemFormSubmitValues } from './ItemFormModal'

interface Props {
  category: Category | null
  onSubmit: (values: CategoryFormValues) => Promise<void>
  onClose: () => void
}

export default function CategoryFormModal({ category, onSubmit, onClose }: Props) {
  function handleSubmit(values: ItemFormSubmitValues) {
    return onSubmit(values)
  }

  return (
    <ItemFormModal
      title={category ? 'تعديل الصنف' : 'إضافة صنف جديد'}
      initialName={category?.name}
      initialDescription={category?.description ?? ''}
      initialImageUrl={resolveImageUrl(category?.image ?? null)}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  )
}
