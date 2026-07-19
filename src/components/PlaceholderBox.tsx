// 보롱이 캐릭터가 들어갈 자리만 표시하는 컴포넌트.
// 실제 캐릭터가 준비되기 전까지는 점선 테두리 + 작은 텍스트만 사용하고,
// 일러스트나 아이콘, 이모지로 대체하지 않는다.
type PlaceholderBoxProps = {
  label: string;
  size?: 'hero' | 'calc';
};

export function PlaceholderBox({ label, size = 'calc' }: PlaceholderBoxProps) {
  return (
    <div className={`placeholder-box placeholder-box--${size}`}>
      <span>{label}</span>
    </div>
  );
}
