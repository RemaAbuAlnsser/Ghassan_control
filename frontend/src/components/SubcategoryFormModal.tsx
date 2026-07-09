import type { Category, Subcategory, SubcategoryFormValues } from '../types/category'
import { resolveImageUrl } from '../api/client'
import ItemFormModal from './ItemFormModal'
import type { ItemFormSubmitValues } from './ItemFormModal'

interface Props {
  category: Category
  subcategory: Subcategory | null
  onSubmit: (values: SubcategoryFormValues) => Promise<void>
  onClose: () => void
}

export default function SubcategoryFormModal({
  category,
  subcategory,
  onSubmit,
  onClose,
}: Props) {
  function handleSubmit(values: ItemFormSubmitValues) {
    return onSubmit({ ...values, categoryId: category.id })
  }

  return (
    <ItemFormModal
      title={subcategory ? 'تعديل الصنف الفرعي' : 'إضافة صنف فرعي'}
      initialName={subcategory?.name}
      initialDescription={subcategory?.description ?? ''}
      initialImageUrl={resolveImageUrl(subcategory?.image ?? null)}
      extraContent={
        <p className="parent-hint">
          الصنف الرئيسي: <strong>{category.name}</strong>
        </p>
      }
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  )
}
