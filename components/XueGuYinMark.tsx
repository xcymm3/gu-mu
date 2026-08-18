type XueGuYinMarkProps = {
  className?: string;
};

export function XueGuYinMark({ className }: XueGuYinMarkProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 64 64">
      <path className="xue-gu-yin-mark__ring" d="M32 7.5a24.5 24.5 0 1 1-17.34 7.16" />
      <path className="xue-gu-yin-mark__ring" d="M12.2 15.3 8.5 10.8m3.7 4.5 5.2-.8" />
      <path className="xue-gu-yin-mark__gate" d="M20.5 47.7V25.8c0-6.35 5.15-11.5 11.5-11.5s11.5 5.15 11.5 11.5v21.9" />
      <path className="xue-gu-yin-mark__gate" d="M16.7 47.7h30.6M26.4 22.6h11.2M32 14.3v33.4" />
      <path className="xue-gu-yin-mark__gu" d="M32 28.8c-3.52 0-6.38 3.32-6.38 7.42S28.48 43.64 32 43.64s6.38-3.32 6.38-7.42S35.52 28.8 32 28.8Z" />
      <path className="xue-gu-yin-mark__gu" d="m26.44 33.2-4.28-2.84m4.1 8.16-4.62 1.72m16.1-7.04 4.28-2.84m-4.1 8.16 4.62 1.72M32 29v-4.06m-2.76 1.9L32 24.94l2.76 1.9" />
      <circle className="xue-gu-yin-mark__core" cx="32" cy="36.2" r="1.6" />
    </svg>
  );
}
