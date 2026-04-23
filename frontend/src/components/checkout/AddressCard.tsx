import type { UserAddress } from '@/types/api'

export function AddressCard({
  address, selected, selectable, onSelect, onEdit, onDelete, onSetDefault,
}: {
  address: UserAddress
  selected?: boolean
  selectable?: boolean
  onSelect?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onSetDefault?: () => void
}) {
  const fullAddress = [address.line1, address.ward, address.district, address.city]
    .filter(Boolean).join(', ')

  const classes = [
    'text-left rounded-2xl border-2 p-4 transition-colors bg-white block w-full',
    selected ? 'border-primary' : 'border-border-soft',
    selectable && !selected ? 'hover:border-primary/40 cursor-pointer' : '',
    !selectable ? 'cursor-default' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} onClick={selectable ? onSelect : undefined} role={selectable ? 'button' : undefined}>
      <div className="flex items-start gap-3">
        {selectable && (
          <span className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${selected ? 'border-primary' : 'border-border-soft'}`}>
            {selected && <span className="block w-2.5 h-2.5 bg-primary rounded-full m-[4px]" />}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-primary text-[14px]">{address.fullName}</span>
            <span className="text-muted text-[13px]">· {address.phone}</span>
            {address.isDefault && (
              <span className="text-[10px] font-display font-bold uppercase tracking-[0.12em] bg-primary text-bg px-2 py-0.5 rounded-full">
                Mặc định
              </span>
            )}
          </div>
          <div className="text-muted text-[13px] mt-1 break-words">{fullAddress}</div>
          {address.note && <div className="text-muted text-[12px] mt-1 italic">Ghi chú: {address.note}</div>}

          {(onEdit || onDelete || onSetDefault) && (
            <div className="flex gap-3 mt-3 text-[12px]">
              {onEdit && (
                <button type="button" onClick={(e) => { e.stopPropagation(); onEdit() }}
                  className="text-primary underline hover:no-underline">Sửa</button>
              )}
              {!address.isDefault && onSetDefault && (
                <button type="button" onClick={(e) => { e.stopPropagation(); onSetDefault() }}
                  className="text-primary underline hover:no-underline">Đặt mặc định</button>
              )}
              {onDelete && (
                <button type="button" onClick={(e) => { e.stopPropagation(); onDelete() }}
                  className="text-red-600 underline hover:no-underline">Xoá</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
