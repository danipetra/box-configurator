type ToggleButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

export default function ToggleButton({
  active,
  label,
  onClick,
}: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-xl px-3 py-2 text-sm font-medium transition',
        active
          ? 'bg-zinc-100 text-zinc-900'
          : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700',
      ].join(' ')}
    >
      {label}
    </button>
  );
}